
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

function Sample2() {
    const [cash, setCash] = useState('15');
    const [newCurrency, setNewCurrency] = useState('1');
    const [convertedValue, setConvertedValue] = useState(15);
    const { theme } = useTheme();
    
    useEffect(() => {
        setConvertedValue(cash * parseFloat(newCurrency));
    }, [cash, newCurrency]);
    
    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">Currency Converter</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="cash">Amount:</Label>
                            <Input
                                id="cash"
                                name="cash"
                                type="number"
                                value={cash}
                                onChange={(e) => setCash(e.target.value)}
                            />
                        </div>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="newcurrency">New Currency:</Label>
                            <Select value={newCurrency} onValueChange={setNewCurrency}>
                                <SelectTrigger id="newcurrency">
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">USD</SelectItem>
                                    <SelectItem value="0.90">EUR</SelectItem>
                                    <SelectItem value="0.75">GBP</SelectItem>
                                    <SelectItem value="1.40">CAD</SelectItem>
                                    <SelectItem value="1.56">AUD</SelectItem>
                                    <SelectItem value="145.94">JPY</SelectItem>
                                    <SelectItem value="7.21">CNY</SelectItem>
                                    <SelectItem value="55.80">PHP</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="p-4 bg-muted rounded-md text-center">
                            <p className="text-lg font-medium">Converted Amount: {convertedValue}</p>
                        </div>
                        
                        <div className="mt-2 text-center text-sm text-muted-foreground">
                            Current Theme: {theme}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default Sample2;
