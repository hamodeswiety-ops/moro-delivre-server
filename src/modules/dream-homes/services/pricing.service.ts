import { Injectable } from '@nestjs/common';
import { PropertyType } from '../entities/dream-home-project.entity';

@Injectable()
export class PricingService {
  private baseRates: Record<PropertyType, number> = {
    villa: 3500,
    apartment: 2800,
    townhouse: 2500,
    mansion: 5000,
    duplex: 3000,
  };

  private complexityMultipliers = {
    simple: 1.0,
    standard: 1.15,
    complex: 1.35,
  };

  private costFactors = {
    labor: 0.35,
    contingency: 0.1,
    tax: 0.15,
  };

  private addOns: Record<string, number> = {
    smart_home: 50000,
    solar_panels: 35000,
    swimming_pool: 75000,
    landscaping: 25000,
    garage_automation: 15000,
    security_system: 12000,
    home_automation: 45000,
    energy_hvac: 20000,
    premium_plumbing: 18000,
    underfloor_heating: 22000,
  };

  calculateBasePrice(
    propertyType: PropertyType,
    area: number,
    complexity: 'simple' | 'standard' | 'complex' = 'standard',
  ): number {
    const baseRate = this.baseRates[propertyType];
    const multiplier = this.complexityMultipliers[complexity];
    return area * baseRate * multiplier;
  }

  calculateFullCost(
    propertyType: PropertyType,
    area: number,
    materialCost: number,
    complexity: 'simple' | 'standard' | 'complex' = 'standard',
  ) {
    const basePrice = this.calculateBasePrice(propertyType, area, complexity);
    const totalMaterials = basePrice * 0.4 + materialCost;
    const labor = totalMaterials * this.costFactors.labor;
    const contingency = (totalMaterials + labor) * this.costFactors.contingency;
    const subtotal = totalMaterials + labor + contingency;
    const tax = subtotal * this.costFactors.tax;
    const total = subtotal + tax;

    return {
      basePrice,
      materials: totalMaterials,
      labor,
      contingency,
      tax,
      subtotal,
      total,
      breakdown: {
        exterior: totalMaterials * 0.25,
        structure: totalMaterials * 0.25,
        interior: totalMaterials * 0.25,
        utilities: totalMaterials * 0.15,
        finishes: totalMaterials * 0.1,
      },
    };
  }

  getPaymentPlans(totalCost: number) {
    return {
      fullPayment: {
        name: 'Pay in Full',
        downPayment: totalCost,
        discount: 0.02,
        finalCost: totalCost * 0.98,
        schedule: [{ payment: totalCost * 0.98, dueDate: 'Upon signing' }],
      },
      quarterly: {
        name: '4 Installments (Quarterly)',
        downPayment: totalCost * 0.25,
        paymentAmount: totalCost * 0.1875,
        schedule: [
          { payment: totalCost * 0.25, dueDate: 'Upon signing', phase: 'Deposit' },
          { payment: totalCost * 0.1875, dueDate: '3 months', phase: 'Foundation' },
          { payment: totalCost * 0.1875, dueDate: '6 months', phase: 'Structure' },
          { payment: totalCost * 0.1875, dueDate: '9 months', phase: 'Finishes' },
        ],
      },
      monthly: {
        name: '12 Monthly Payments',
        downPayment: totalCost * 0.15,
        monthlyPayment: (totalCost * 0.85) / 12,
        schedule: Array.from({ length: 12 }, (_, i) => ({
          month: i + 1,
          payment: (totalCost * 0.85) / 12,
        })),
      },
    };
  }

  getFinancingOptions(totalCost: number) {
    return {
      cash: {
        name: 'Cash Payment',
        downPayment: totalCost,
        discount: 0.05,
        finalCost: totalCost * 0.95,
      },
      mortgage: {
        name: 'Bank Mortgage (20 years)',
        downPayment: totalCost * 0.2,
        monthlyPayment: this.calculateMortgage(totalCost * 0.8, 20, 0.035),
        interestRate: 0.035,
        totalPayments: 240,
      },
      constructionLoan: {
        name: 'Construction Loan (Phased)',
        downPayment: totalCost * 0.15,
        drawPercentages: [0.25, 0.25, 0.25, 0.15],
        interestRate: 0.045,
      },
    };
  }

  private calculateMortgage(
    principal: number,
    years: number,
    interestRate: number,
  ): number {
    const monthlyRate = interestRate / 12;
    const numberOfPayments = years * 12;
    return (
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    );
  }

  applyAddOns(baseCost: number, selectedAddOns: string[]): number {
    let total = baseCost;
    for (const addOn of selectedAddOns) {
      if (this.addOns[addOn]) {
        total += this.addOns[addOn];
      }
    }
    return total;
  }

  applyDiscount(cost: number, discountPercent: number): number {
    return cost * (1 - discountPercent / 100);
  }

  getAddOns() {
    return this.addOns;
  }
}
