export interface Vitals {
    heartRate: number;
    bloodPressure: string;
    oxygenLevel: number;
    temperature: number;
}

export function generateSafeVitals(riskLevel: 'LOW' | 'MEDIUM' | 'HIGH', currentVitals?: Partial<Vitals>): Vitals {
    // Base healthy ranges
    const healthy = {
        hr: [60, 90],
        spo2: [96, 100],
        temp: [36.5, 37.3]
    };

    // Helper to get random in range
    const r = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
    const rFloat = (min: number, max: number) => Number((Math.random() * (max - min) + min).toFixed(1));

    let hr = currentVitals?.heartRate || 0;
    let spo2 = currentVitals?.oxygenLevel || 0;
    let temp = currentVitals?.temperature || 0;
    let bp = currentVitals?.bloodPressure || '';

    // Generate missing or invalid (0 or impossible) vitals based on risk
    if (hr <= 0 || hr > 250) {
        if (riskLevel === 'HIGH') hr = r(110, 140);
        else if (riskLevel === 'MEDIUM') hr = r(95, 115);
        else hr = r(healthy.hr[0], healthy.hr[1]);
    }

    if (spo2 <= 0 || spo2 > 100) {
        if (riskLevel === 'HIGH') spo2 = r(85, 91);
        else if (riskLevel === 'MEDIUM') spo2 = r(92, 95);
        else spo2 = r(healthy.spo2[0], healthy.spo2[1]);
    }

    if (temp <= 0 || temp > 43) {
        if (riskLevel === 'HIGH') temp = rFloat(38.8, 40.0);
        else if (riskLevel === 'MEDIUM') temp = rFloat(37.8, 38.6);
        else temp = rFloat(healthy.temp[0], healthy.temp[1]);
    }

    if (!bp || bp === '0/0') {
        if (riskLevel === 'HIGH') bp = `${r(80, 95)}/${r(50, 60)}`;
        else if (riskLevel === 'MEDIUM') bp = `${r(100, 115)}/${r(65, 75)}`;
        else bp = `${r(115, 125)}/${r(75, 80)}`;
    }

    return {
        heartRate: hr,
        bloodPressure: bp,
        oxygenLevel: spo2,
        temperature: temp
    };
}
