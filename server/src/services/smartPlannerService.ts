export class SmartPlannerService {
  static async getSuggestions(params: {
    budget: number;
    weather?: string;
    rushHour?: boolean;
    travelModePreference?: string;
    mood?: string;
    origin: string;
    destination: string;
  }) {
    const suggestions: any = {
      recommended_mode: this.selectTransportMode(params),
      reasons: [],
      alternatives: [],
      tips: [],
    };

    // Budget-based recommendations
    if (params.budget < 5000) {
      suggestions.recommended_mode = 'bus';
      suggestions.reasons.push('Budget-friendly option');
      suggestions.alternatives = ['train_general', 'bike_rental'];
    } else if (params.budget < 15000) {
      suggestions.recommended_mode = 'train';
      suggestions.reasons.push('Good balance of comfort and price');
      suggestions.alternatives = ['cab', 'bus'];
    } else if (params.budget < 30000) {
      suggestions.recommended_mode = 'flight_economy';
      suggestions.reasons.push('Fastest option within budget');
      suggestions.alternatives = ['train_ac', 'cab_premium'];
    } else {
      suggestions.recommended_mode = 'flight_business';
      suggestions.reasons.push('Premium experience');
      suggestions.alternatives = ['private_jet', 'cruise'];
    }

    // Weather considerations
    if (params.weather === 'rainy') {
      suggestions.reasons.push('Rainy season: Indoor transport recommended');
      suggestions.tips.push('Book flights or trains for weather protection');
    }

    // Mood-based suggestions
    if (params.mood === 'adventurous') {
      suggestions.alternatives.push('bike_rental');
      suggestions.tips.push('Consider bike rental for scenic routes');
    } else if (params.mood === 'relaxed') {
      suggestions.alternatives.push('cruise');
      suggestions.tips.push('Cruise offers leisure and comfort');
    }

    // Rush hour considerations
    if (params.rushHour) {
      suggestions.tips.push('Avoid peak hours (8-11 AM, 5-8 PM)');
      suggestions.tips.push('Book for early morning or late evening');
    }

    return suggestions;
  }

  private static selectTransportMode(params: any): string {
    if (params.travelModePreference) {
      return params.travelModePreference;
    }

    if (params.mood === 'adventurous') return 'bike_rental';
    if (params.mood === 'luxurious') return 'private_jet';
    if (params.mood === 'eco_conscious') return 'train';
    if (params.mood === 'social') return 'cruise';

    return 'flight_economy';
  }
}
