
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Container } from "@/components/ui/container";

const About: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Container className="flex-grow py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">About LiquorLink</h1>
          
          <div className="space-y-6">
            <p className="text-lg">
              LiquorLink is a full-featured online liquor store platform built for modern convenience and operational efficiency. It enables customers to browse, purchase, and receive alcoholic beverages with just a few taps — while giving liquor store owners powerful tools to manage inventory, track sales, and streamline deliveries.
            </p>
            
            <p className="text-lg">
              The liquor industry remains largely offline, with limited tech integration for small and medium-sized sellers. LiquorLink fills this gap by offering a scalable, user-friendly solution that simplifies order management, real-time stock tracking, and delivery logistics — all within one unified system.
            </p>
            
            <p className="text-lg">
              With a growing demand for online alcohol sales, especially in urban markets, LiquorLink is positioned to capitalize on both B2C and B2B opportunities. We're building more than an app — we're creating the digital backbone for the future of liquor retail.
            </p>
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default About;
