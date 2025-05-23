
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Send, MessageCircle, Rocket, Globe } from "lucide-react";
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
      <div className="relative bg-gradient-to-br from-primary/40 to-accent/30 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80')] bg-no-repeat bg-cover blur-sm"></div>
        </div>
        <Container>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <div className="inline-block animate-fadeIn mb-6">
              <div className="bg-background/80 backdrop-blur-sm p-3 rounded-full">
                <MessageCircle className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fadeIn">Get in Touch</h1>
            <p className="text-xl opacity-90 backdrop-blur-sm bg-background/30 inline-block px-4 py-2 rounded-lg">
              Have questions, feedback, or partnership opportunities? We'd love to hear from you.
            </p>
          </div>
        </Container>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent"></div>
      </div>
      
      <Container className="flex-grow py-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Contact Form */}
            <div className="bg-card/50 backdrop-blur-sm p-8 rounded-xl border border-accent/10 shadow-lg transform hover:shadow-xl transition-all duration-300">
              <div className="space-y-2">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary mb-4">
                  <Mail className="mr-2 h-4 w-4" />
                  <span className="font-medium text-sm">Send a Message</span>
                </div>
                <h2 className="text-3xl font-bold">Let's Connect</h2>
                <p className="text-muted-foreground pb-4">
                  Whether you're a customer needing support, a liquor brand looking to partner, or an investor 
                  interested in our vision — we're ready to assist you.
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
                    className="border-accent/20 focus:border-primary"
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
                    className="border-accent/20 focus:border-primary"
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
                    className="resize-none border-accent/20 focus:border-primary"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full sm:w-auto transform hover:translate-y-[-2px] transition-all"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Sending<span className="animate-pulse">...</span></>
                  ) : (
                    <>Send Message <Send className="ml-2 h-4 w-4" /></>
                  )}
                </Button>
              </form>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="bg-card/50 backdrop-blur-sm shadow-lg border-accent/10 overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 bg-primary/10 h-24 w-24 rounded-bl-full"></div>
                <CardContent className="p-8 relative">
                  <h3 className="text-2xl font-bold mb-6 flex items-center">
                    <span className="bg-primary/10 p-2 rounded-full mr-3">
                      <Phone className="h-5 w-5 text-primary" />
                    </span>
                    Contact Information
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4 items-start group/item hover:bg-accent/5 p-3 rounded-lg transition-colors">
                      <div className="bg-primary/10 rounded-full p-3 group-hover/item:bg-primary/20 transition-colors">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Email</h4>
                        <a href="mailto:support@liquorlink.app" className="text-muted-foreground hover:text-primary transition-colors">
                          support@liquorlink.app
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start group/item hover:bg-accent/5 p-3 rounded-lg transition-colors">
                      <div className="bg-primary/10 rounded-full p-3 group-hover/item:bg-primary/20 transition-colors">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Phone</h4>
                        <a href="tel:+639123456789" className="text-muted-foreground hover:text-primary transition-colors">
                          +63 912 345 6789
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start group/item hover:bg-accent/5 p-3 rounded-lg transition-colors">
                      <div className="bg-primary/10 rounded-full p-3 group-hover/item:bg-primary/20 transition-colors">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Address</h4>
                        <p className="text-muted-foreground">
                          123 LiquorLink Avenue, Makati City, Metro Manila, Philippines
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-10 pt-6 border-t border-border relative">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background px-4">
                      <Globe className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-semibold text-lg mb-4 text-center">Follow Us</h4>
                    <div className="flex gap-3 justify-center">
                      <a href="https://facebook.com/LiquorLinkPH" 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="bg-card hover:bg-accent hover:text-accent-foreground transition-colors p-3 rounded-full shadow-sm hover:shadow-md">
                        <Facebook className="h-5 w-5" />
                      </a>
                      <a href="https://instagram.com/liquorlink.ph" 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="bg-card hover:bg-accent hover:text-accent-foreground transition-colors p-3 rounded-full shadow-sm hover:shadow-md">
                        <Instagram className="h-5 w-5" />
                      </a>
                      <a href="https://linkedin.com/company/liquorlink" 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="bg-card hover:bg-accent hover:text-accent-foreground transition-colors p-3 rounded-full shadow-sm hover:shadow-md">
                        <Linkedin className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-accent/10 overflow-hidden relative hover:shadow-lg transition-all group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-primary" />
                    Business & Partnerships
                  </CardTitle>
                  <CardDescription>
                    Let's grow the liquor industry together
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-6">
                  <p className="text-muted-foreground mb-4">
                    Are you a local distributor, bar, or retail store owner looking to expand your reach? 
                    Our partnership program offers exclusive benefits.
                  </p>
                  <Button variant="outline" asChild className="group-hover:border-primary group-hover:text-primary transition-all">
                    <a href="mailto:partners@liquorlink.app">
                      Email us at partners@liquorlink.app
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Map Section - Use a placeholder image as we can't integrate Google Maps directly */}
          <div className="mt-12 rounded-xl overflow-hidden shadow-lg border border-accent/10 h-[300px] md:h-[400px] relative group hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/20 group-hover:opacity-80 transition-opacity"></div>
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="bg-background/80 backdrop-blur-sm py-3 px-6 rounded-lg shadow-lg">
                <p className="text-muted-foreground font-medium">Our Location</p>
              </div>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&h=400&q=80" 
              alt="Map location" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default Contact;
