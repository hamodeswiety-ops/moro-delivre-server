import { Injectable } from '@nestjs/common';

export interface PricingQuote {
  projectId: string;
  materials: number;
  labor: number;
  contingency: number;
  taxes: number;
  total: number;
  breakdown: {
    exterior: number;
    structure: number;
    interior: number;
    utilities: number;
    finishes: number;
  };
}

@Injectable()
export class PricingService {
  private costMultipliers = {
    material: 1.0,
    labor: 0.35, // Labor is 35% of material cost typically
    contingency: 0.1, // 10% contingency
    taxRate: 0.15, // 15% tax
  };

  private areaRates = {
    // Price per square meter based on property type
    villa: 3500,
    apartment: 2800,
    townhouse: 2500,
    mansion: 5000,
    duplex: 3000,
  };

  calculateQuote(
    projectData: {
      propertyType: string;
      totalArea: number;
      materials: number;
      designComplexity: 'simple' | 'standard' | 'complex';
    }
  ): PricingQuote {
    const baseRate = this.areaRates[projectData.propertyType] || 3000;
    const baseStructuralCost = projectData.totalArea * baseRate;

    let materialsCost = projectData.materials;
    let structureCost = baseStructuralCost * 0.4;
    let interiorCost = baseStructuralCost * 0.3;
    let utilitiesCost = baseStructuralCost * 0.15;
    let finishesCost = projectData.materials * 0.2;

    // Adjust for design complexity
    const complexityMultiplier = {
      simple: 1.0,
      standard: 1.15,
      complex: 1.35,
    };
    const multiplier = complexityMultiplier[projectData.designComplexity];

    materialsCost *= multiplier;
    structureCost *= multiplier;
    interiorCost *= multiplier;
    finishesCost *= multiplier;

    const subtotal = materialsCost + structureCost + interiorCost + utilitiesCost + finishesCost;
    const labor = subtotal * this.costMultipliers.labor;
    const contingency = subtotal * this.costMultipliers.contingency;
    const subtotalWithLabor = subtotal + labor + contingency;
    const taxes = subtotalWithLabor * this.costMultipliers.taxRate;
    const total = subtotalWithLabor + taxes;

    return {
      projectId: '',
      materials: materialsCost,
      labor,
      contingency,
      taxes,
      total,
      breakdown: {
        exterior: materialsCost,
        structure: structureCost,
        interior: interiorCost,
        utilities: utilitiesCost,
        finishes: finishesCost,
      },
    };
  }

  calculatePaymentPlan(
    totalCost: number,
    terms: 'immediate' | 'installments' | 'monthly' = 'installments',
  ): { installments: Array<{ month: number; amount: number; description: string }> } {
    const installments = [];

    if (terms === 'immediate') {
      installments.push({
        month: 0,
        amount: totalCost,
        description: 'Full Payment',
      });
    } else if (terms === 'installments') {
      const installmentAmount = totalCost / 4;
      installments.push(
        { month: 0, amount: installmentAmount * 0.25, description: 'Deposit (25%)' },
        { month: 2, amount: installmentAmount * 0.25, description: 'Foundation & Structure (25%)' },
        { month: 4, amount: installmentAmount * 0.25, description: 'Interior & Finishes (25%)' },
        { month: 6, amount: installmentAmount * 0.25, description: 'Final & Handover (25%)' },
      );
    } else if (terms === 'monthly') {
      const monthlyAmount = totalCost / 12;
      for (let i = 0; i < 12; i++) {
        installments.push({
          month: i,
          amount: monthlyAmount,
          description: `Monthly Payment ${i + 1}`,
        });
      }
    }

    return { installments };
  }

  addOnCosts = {
    smart_home: 50000,
    solar_panels: 35000,
    swimming_pool: 75000,
    landscaping: 25000,
    garage_automation: 15000,
    security_system: 12000,
    home_automation: 45000,
    energy_efficient_hvac: 20000,
    premium_plumbing: 18000,
    underfloor_heating: 22000,
  };

  getAddOns() {
    return this.addOnCosts;
  }

  calculateWithAddOns(baseCost: number, selectedAddOns: string[]): number {
    let total = baseCost;
    for (const addOn of selectedAddOns) {
      if (this.addOnCosts[addOn]) {
        total += this.addOnCosts[addOn];
      }
    }
    return total;
  }

  applyDiscount(totalCost: number, discountPercent: number): number {
    return totalCost * (1 - discountPercent / 100);
  }

  getFinancingOptions(totalCost: number) {
    return {
      cashPayment: {
        option: 'Pay in Full',
        downPayment: totalCost,
        discount: '2%',
        finalCost: totalCost * 0.98,
      },
      mortgage: {
        option: 'Bank Mortgage',
        downPayment: totalCost * 0.2,
        monthlyPayment: (totalCost * 0.8) / 240, // 20 year mortgage
        interestRate: '3.5%',
        totalCost: (totalCost * 0.8) / 240 * 240 + totalCost * 0.2,
      },
      constructionLoan: {
        option: 'Construction Loan',
        downPayment: totalCost * 0.15,
        drawPercentages: [0.25, 0.25, 0.25, 0.25],
        interestRate: '4.5%',
      },
    };
  }
}
