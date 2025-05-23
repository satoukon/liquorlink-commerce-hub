
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wine, Star } from "lucide-react";
import { Link } from "react-router-dom";

const About: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/30 to-accent/40 py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fadeIn">About LiquorLink</h1>
            <p className="text-xl opacity-90">Transforming the way you shop for premium spirits</p>
          </div>
        </Container>
      </div>
      
      <Container className="flex-grow py-12">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Mission Section */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary">
                <Star className="mr-2 h-4 w-4" />
                <span className="font-medium">Our Mission</span>
              </div>
              <h2 className="text-3xl font-bold">Revolutionizing Liquor Retail</h2>
              <p className="text-lg">
                LiquorLink is a full-featured online liquor store platform built for modern convenience and operational efficiency. It enables customers to browse, purchase, and receive alcoholic beverages with just a few taps — while giving liquor store owners powerful tools to manage inventory, track sales, and streamline deliveries.
              </p>
              <Link to="/products">
                <Button className="group">
                  Browse Our Products
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <Card className="p-1 border-2 border-muted rotate-3 shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=600&q=80" 
                  alt="Person ordering online" 
                  className="rounded-sm w-full h-auto"
                />
              </Card>
              <Card className="absolute -bottom-4 -left-4 p-1 border-2 border-muted -rotate-3 shadow-lg w-40">
                <img 
                  src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=200&q=80" 
                  alt="Digital display" 
                  className="rounded-sm w-full h-auto"
                />
              </Card>
            </div>
          </div>
          
          {/* Solution Section */}
          <Card className="overflow-hidden border-none shadow-xl">
            <div className="bg-gradient-to-br from-card to-secondary p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                  <Wine className="h-12 w-12 text-primary mb-4" />
                  <h2 className="text-3xl font-bold mb-6">Filling the Tech Gap</h2>
                  <p className="text-lg mb-6">
                    The liquor industry remains largely offline, with limited tech integration for small and medium-sized sellers. LiquorLink fills this gap by offering a scalable, user-friendly solution that simplifies order management, real-time stock tracking, and delivery logistics — all within one unified system.
                  </p>
                </div>
                <div className="md:w-1/2 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-xl transform -rotate-3"></div>
                    <img 
                      src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80" 
                      alt="Tech illustration" 
                      className="rounded-xl relative z-10 w-full h-auto transform rotate-3 shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Future Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">The Future of Liquor Retail</h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto">
              With a growing demand for online alcohol sales, especially in urban markets, LiquorLink is positioned to capitalize on both B2C and B2B opportunities. We're building more than an app — we're creating the digital backbone for the future of liquor retail.
            </p>
            <div className="inline-flex gap-4">
              <Link to="/contact">
                <Button variant="outline" size="lg">
                  Contact Us
                </Button>
              </Link>
              <Link to="/products">
                <Button size="lg">
                  Start Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default About;
