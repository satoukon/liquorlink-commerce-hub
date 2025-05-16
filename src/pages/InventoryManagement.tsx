
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '../data/products';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
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

type InventoryFormValues = z.infer<typeof inventoryFormSchema>;

const InventoryManagement: React.FC = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<ProductWithInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
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

  // Fetch products and inventory data
  const fetchProductsWithInventory = async () => {
    setLoading(true);
    try {
      // Fetch all products from our local data
      const localProducts = (await import('../data/products')).products;
      
      // Fetch inventory data from Supabase
      const { data: inventoryData, error } = await supabase
        .from('inventory')
        .select('*');
        
      if (error) throw error;

      // Map inventory data to products
      const productsWithInventory = localProducts.map(product => {
        const inventoryItem = inventoryData?.find(item => item.product_id === product.id) as InventoryItem | undefined;
        const isLowStock = inventoryItem ? inventoryItem.quantity <= inventoryItem.low_stock_threshold : false;
        
        return {
          ...product,
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
