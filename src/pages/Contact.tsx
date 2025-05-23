
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      setFormData({ name: "", email: "", message: "" });
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/30 to-accent/40 py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fadeIn">Contact Us</h1>
            <p className="text-xl opacity-90">Have questions, feedback, or partnership opportunities? We'd love to hear from you.</p>
          </div>
        </Container>
      </div>
      
      <Container className="flex-grow py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Form */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">Get in Touch</h2>
                <p className="text-muted-foreground">
                  Whether you're a customer needing support, a liquor brand looking to partner, or an investor 
                  interested in our vision — we're here and ready to connect.
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block mb-2 font-medium">Name</label>
                  <Input 
                    id="name"
                    name="name"
                    type="text" 
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange} 
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block mb-2 font-medium">Email</label>
                  <Input 
                    id="email"
                    name="email"
                    type="email" 
                    placeholder="Your email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block mb-2 font-medium">Message</label>
                  <Textarea 
                    id="message"
                    name="message"
                    placeholder="How can we help you?"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="resize-none"
                  />
                </div>
                
                <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>Sending<span className="animate-pulse">...</span></>
                  ) : (
                    <>Send Message <Send className="ml-2 h-4 w-4" /></>
                  )}
                </Button>
              </form>
            </div>
            
            {/* Contact Information */}
            <div>
              <Card className="bg-card/50 backdrop-blur shadow-lg border-accent/10">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4 items-start">
                      <div className="bg-primary/10 rounded-full p-3">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Email</h4>
                        <p className="text-muted-foreground">support@liquorlink.app</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <div className="bg-primary/10 rounded-full p-3">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Phone</h4>
                        <p className="text-muted-foreground">+63 912 345 6789</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <div className="bg-primary/10 rounded-full p-3">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Address</h4>
                        <p className="text-muted-foreground">123 LiquorLink Avenue, Makati City, Metro Manila, Philippines</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-border">
                    <h4 className="font-semibold text-lg mb-4">Follow Us</h4>
                    <div className="flex gap-4">
                      <a href="https://facebook.com/LiquorLinkPH" target="_blank" rel="noopener noreferrer" 
                         className="bg-card hover:bg-accent transition-colors p-3 rounded-full">
                        <Facebook className="h-5 w-5" />
                      </a>
                      <a href="https://instagram.com/liquorlink.ph" target="_blank" rel="noopener noreferrer"
                         className="bg-card hover:bg-accent transition-colors p-3 rounded-full">
                        <Instagram className="h-5 w-5" />
                      </a>
                      <a href="https://linkedin.com/company/liquorlink" target="_blank" rel="noopener noreferrer"
                         className="bg-card hover:bg-accent transition-colors p-3 rounded-full">
                        <Linkedin className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6 border-accent/10">
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-2">Business & Partnerships</h3>
                  <p className="text-muted-foreground mb-4">
                    Are you a local distributor, bar, or retail store owner looking to expand your reach? 
                    Let's collaborate!
                  </p>
                  <Button variant="outline" asChild>
                    <a href="mailto:partners@liquorlink.app">
                      Email us at partners@liquorlink.app
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Map Section - Use a placeholder image as we can't integrate Google Maps directly */}
          <div className="mt-12 rounded-xl overflow-hidden shadow-lg border border-accent/10 h-[300px] md:h-[400px] relative">
            <div className="absolute inset-0 bg-accent/5 flex items-center justify-center">
              <p className="text-muted-foreground">Interactive map would be displayed here</p>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=1200&h=400&q=80" 
              alt="Map location" 
              className="w-full h-full object-cover opacity-50"
            />
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default Contact;
