
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { toast } from '@/components/ui/sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, AlertCircle, PackagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { createProduct, getCategoriesWithDetails } from '../services/productService';
import { Product, Category } from '../types/product';

// Define interfaces
interface InventoryItem {
  id: string;
  product_id: string;
  quantity: number;
  low_stock_threshold: number;
  created_at: string;
  updated_at: string;
}

interface ProductWithInventory extends Product {
  inventory?: InventoryItem;
  isLowStock?: boolean;
}

// Create form schema
const inventoryFormSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  quantity: z.coerce.number().min(0, 'Quantity must be 0 or higher'),
  lowStockThreshold: z.coerce.number().min(1, 'Threshold must be at least 1'),
});

// Create product form schema
const productFormSchema = z.object({
  name: z.string().min(2, 'Name is required and must be at least 2 characters'),
  brand: z.string().min(1, 'Brand is required'),
  category_id: z.string().min(1, 'Category is required'),
  volume: z.coerce.number().min(0, 'Volume must be 0 or higher'),
  alcoholContent: z.coerce.number().min(0, 'Alcohol content must be 0 or higher').max(100, 'Alcohol content cannot exceed 100%'),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  image: z.string().default('/placeholder.svg'),
  description: z.string().optional(),
});

type InventoryFormValues = z.infer<typeof inventoryFormSchema>;
type ProductFormValues = z.infer<typeof productFormSchema>;

const InventoryManagement: React.FC = () => {
  const { toast } = useToast();
  const { authState } = useAuth();
  const [products, setProducts] = useState<ProductWithInventory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewProductDialogOpen, setIsNewProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithInventory | null>(null);
  const [filter, setFilter] = useState('');
  
  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(inventoryFormSchema),
    defaultValues: {
      productId: '',
      quantity: 0,
      lowStockThreshold: 5,
    },
  });

  const editForm = useForm<InventoryFormValues>({
    resolver: zodResolver(inventoryFormSchema),
    defaultValues: {
      productId: '',
      quantity: 0,
      lowStockThreshold: 5,
    },
  });

  const productForm = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      brand: '',
      category_id: '',
      volume: 0,
      alcoholContent: 0,
      price: 0,
      image: '/placeholder.svg',
      description: '',
    },
  });

  // Check if user is admin
  useEffect(() => {
    if (!authState.isAdmin) {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to access this page",
        variant: "destructive",
      });
      // Redirect to home after a short delay
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    }
  }, [authState.isAdmin, toast]);

  // Fetch categories for product form
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategoriesWithDetails();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  // Fetch products and inventory data
  const fetchProductsWithInventory = async () => {
    setLoading(true);
    try {
      // Fetch all products from our local data
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*, categories(name, id)');
        
      if (productsError) throw productsError;
      
      // Fetch inventory data from Supabase
      const { data: inventoryData, error } = await supabase
        .from('inventory')
        .select('*');
        
      if (error) throw error;

      // Map inventory data to products
      const productsWithInventory = productsData.map(product => {
        const inventoryItem = inventoryData?.find(item => item.product_id === product.id) as InventoryItem | undefined;
        const isLowStock = inventoryItem ? inventoryItem.quantity <= inventoryItem.low_stock_threshold : false;
        
        return {
          id: product.id,
          name: product.name,
          brand: product.brand || "",
          category: product.categories?.name || "mixers",
          category_id: product.category_id || product.categories?.id,
          volume: product.volume || 0,
          alcoholContent: product.alcohol_content || 0,
          price: product.price,
          image: product.image || "/placeholder.svg",
          description: product.description || "",
          stock: inventoryItem?.quantity || 0,
          featured: false,
          inventory: inventoryItem,
          isLowStock
        };
      });
      
      setProducts(productsWithInventory);
    } catch (error) {
      console.error('Error fetching products with inventory:', error);
      toast({
        title: 'Error',
        description: 'Failed to load inventory data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsWithInventory();
  }, []);

  // Handle adding new inventory
  const handleAddInventory = async (values: InventoryFormValues) => {
    try {
      const { productId, quantity, lowStockThreshold } = values;
      
      // Check if inventory already exists for this product
      const { data: existingInventory, error: checkError } = await supabase
        .from('inventory')
        .select('*')
        .eq('product_id', productId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      if (existingInventory) {
        // Update existing inventory
        const { error } = await supabase
          .from('inventory')
          .update({
            quantity,
            low_stock_threshold: lowStockThreshold
          })
          .eq('product_id', productId);
          
        if (error) throw error;
        
        toast({
          title: 'Inventory Updated',
          description: 'Product inventory has been updated successfully',
        });
      } else {
        // Insert new inventory
        const { error } = await supabase
          .from('inventory')
          .insert({
            product_id: productId,
            quantity,
            low_stock_threshold: lowStockThreshold
          });
          
        if (error) throw error;
        
        toast({
          title: 'Inventory Added',
          description: 'Product has been added to inventory successfully',
        });
      }
      
      setIsAddDialogOpen(false);
      form.reset();
      await fetchProductsWithInventory();
    } catch (error) {
      console.error('Error adding inventory:', error);
      toast({
        title: 'Error',
        description: 'Failed to add inventory data',
        variant: 'destructive',
      });
    }
  };

  // Handle editing inventory
  const handleEditInventory = async (values: InventoryFormValues) => {
    if (!selectedProduct || !selectedProduct.inventory) return;
    
    try {
      const { quantity, lowStockThreshold } = values;
      
      const { error } = await supabase
        .from('inventory')
        .update({
          quantity,
          low_stock_threshold: lowStockThreshold
        })
        .eq('id', selectedProduct.inventory.id);
        
      if (error) throw error;
      
      toast({
        title: 'Inventory Updated',
        description: 'Product inventory has been updated successfully',
      });
      
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
      editForm.reset();
      await fetchProductsWithInventory();
    } catch (error) {
      console.error('Error updating inventory:', error);
      toast({
        title: 'Error',
        description: 'Failed to update inventory data',
        variant: 'destructive',
      });
    }
  };

  // Handle adding new product
  const handleAddProduct = async (values: ProductFormValues) => {
    try {
      await createProduct({
        name: values.name,
        brand: values.brand,
        category: "", // This will be filled from category_id
        category_id: values.category_id,
        volume: values.volume,
        alcoholContent: values.alcoholContent,
        price: values.price,
        image: values.image,
        description: values.description || "",
      });

      toast({
        title: 'Product Created',
        description: 'New product has been created successfully',
      });

      setIsNewProductDialogOpen(false);
      productForm.reset();
      await fetchProductsWithInventory();
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: 'Error',
        description: 'Failed to create new product',
        variant: 'destructive',
      });
    }
  };

  // Handle deleting inventory
  const handleDeleteInventory = async (inventoryId: string) => {
    try {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', inventoryId);
        
      if (error) throw error;
      
      toast({
        title: 'Inventory Removed',
        description: 'Product has been removed from inventory successfully',
      });
      
      await fetchProductsWithInventory();
    } catch (error) {
      console.error('Error deleting inventory:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete inventory data',
        variant: 'destructive',
      });
    }
  };

  // Filtered products based on search
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(filter.toLowerCase()) || 
    product.category.toLowerCase().includes(filter.toLowerCase()) ||
    product.brand.toLowerCase().includes(filter.toLowerCase())
  );

  // Open edit dialog and set form values
  const openEditDialog = (product: ProductWithInventory) => {
    if (product.inventory) {
      setSelectedProduct(product);
      editForm.reset({
        productId: product.id,
        quantity: product.inventory.quantity,
        lowStockThreshold: product.inventory.low_stock_threshold
      });
      setIsEditDialogOpen(true);
    }
  };

  if (!authState.isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p>You need admin privileges to access this page.</p>
            <p>Redirecting to home...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <Cart />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Inventory Management</h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Input
              placeholder="Search products..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full sm:w-64"
            />
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="whitespace-nowrap">
                  <Plus className="mr-2 h-4 w-4" /> Add Inventory
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Inventory</DialogTitle>
                  <DialogDescription>
                    Add or update inventory for a product
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddInventory)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="productId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <option value="">Select a product</option>
                              {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                  {product.name} ({product.id})
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lowStockThreshold"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Low Stock Threshold</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button type="submit">Save</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            
            {/* New Product Button */}
            <Dialog open={isNewProductDialogOpen} onOpenChange={setIsNewProductDialogOpen}>
              <DialogTrigger asChild>
                <Button className="whitespace-nowrap" variant="secondary">
                  <PackagePlus className="mr-2 h-4 w-4" /> New Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Create a new product in the inventory
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...productForm}>
                  <form onSubmit={productForm.handleSubmit(handleAddProduct)} className="space-y-4">
                    <FormField
                      control={productForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={productForm.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={productForm.control}
                      name="category_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <option value="">Select a category</option>
                              {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={productForm.control}
                        name="volume"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Volume (ml)</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={productForm.control}
                        name="alcoholContent"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Alcohol %</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" max="100" step="0.1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={productForm.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price ($)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0.01" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={productForm.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="/placeholder.svg" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={productForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={3} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button type="submit">Create Product</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center p-8">
            <p>Loading inventory data...</p>
          </div>
        ) : (
          <div className="bg-card rounded-lg shadow overflow-hidden">
            <Table>
              <TableCaption>Inventory Management System</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Low Stock Threshold</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.brand}</TableCell>
                      <TableCell className="text-right">
                        {product.inventory ? product.inventory.quantity : 'Not tracked'}
                      </TableCell>
                      <TableCell className="text-right">
                        {product.inventory ? product.inventory.low_stock_threshold : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {product.inventory ? (
                          product.isLowStock ? (
                            <span className="inline-flex items-center text-amber-500">
                              <AlertCircle className="mr-1 h-4 w-4" /> Low Stock
                            </span>
                          ) : (
                            <span className="text-green-500">In Stock</span>
                          )
                        ) : (
                          'Not tracked'
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {product.inventory ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openEditDialog(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteInventory(product.inventory!.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                form.setValue('productId', product.id);
                                setIsAddDialogOpen(true);
                              }}
                            >
                              <Plus className="h-4 w-4" /> Track
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
      
      {/* Edit Inventory Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Inventory</DialogTitle>
            <DialogDescription>
              Update inventory for {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditInventory)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="lowStockThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Low Stock Threshold</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">Update</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default InventoryManagement;
