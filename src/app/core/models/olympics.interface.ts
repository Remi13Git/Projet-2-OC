
export interface Participation {
  year: number;
  medalsCount: number;
  athleteCount: number
}
  
  export interface Country {
    country: string;
    participations: Participation[];
  }
  
  export interface OlympicData {
    countries: Country[];
  }
  