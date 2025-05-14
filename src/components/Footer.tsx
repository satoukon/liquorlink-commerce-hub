
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-card mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">LiquorLink</h3>
            <p className="text-muted-foreground">
              Premium alcohol delivery service. Quality spirits, wine, and beer delivered to your door.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=beer" className="text-muted-foreground hover:text-primary transition-colors">
                  Beer
                </Link>
              </li>
              <li>
                <Link to="/products?category=wine" className="text-muted-foreground hover:text-primary transition-colors">
                  Wine
                </Link>
              </li>
              <li>
                <Link to="/products?category=spirits" className="text-muted-foreground hover:text-primary transition-colors">
                  Spirits
                </Link>
              </li>
              <li>
                <Link to="/products?category=mixers" className="text-muted-foreground hover:text-primary transition-colors">
                  Mixers
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-muted-foreground hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <address className="not-italic text-muted-foreground">
              <p>123 Liquor Avenue</p>
              <p>Wine Valley, CA 90210</p>
              <p className="mt-2">info@liquorlink.com</p>
              <p>(555) 123-4567</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} LiquorLink. All rights reserved.</p>
          <p className="text-sm mt-1">
            Please drink responsibly. Must be 21+ to purchase. ID verification required on delivery.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
