import { NextResponse } from 'next/server';

/**
 * Proxy API pour sécuriser les appels à l'API externe
 * Cette route intercepte les requêtes et ajoute le token d'authentification
 */
export async function POST(request) {
    try {
        // Récupérer les paramètres de recherche
        const { searchParams } = new URL(request.url);
        const endpoint = searchParams.get('endpoint') || 'chat';

        // Récupérer le corps de la requête
        const body = await request.json();

        // Construire l'URL complète
        let apiUrl = `${process.env.API_OSI}/api/${endpoint}`;

        // Cas spécial pour evaluate_response qui nécessite le conversation_id dans l'URL
        if (endpoint === 'evaluate_response') {
            const conversationId = searchParams.get('conversation_id');
            if (conversationId) {
                apiUrl = `${process.env.API_OSI}/api/evaluate_response?conversation_id=${conversationId}`;

                // Log pour le débogage
                // console.log('Appel API d\'évaluation vers:', apiUrl);
                // console.log('Corps de la requête d\'évaluation:', body);
            }
        }

        // Effectuer la requête à l'API externe avec le token d'authentification
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.API_TOKEN_OSI}`
            },
            body: JSON.stringify(body)
        });

        // Récupérer les données de la réponse
        let data;
        try {
            data = await response.json();
        } catch (error) {
            // Si la réponse n'est pas du JSON valide, renvoyer un objet vide
            data = {};
        }

        // Log pour le débogage
        // console.log('Réponse API:', response.status, data);

        // Renvoyer la réponse avec le même statut
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Erreur proxy API:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la communication avec le serveur' },
            { status: 500 }
        );
    }
}

// Gérer les requêtes GET (pour les endpoints comme evaluate_response qui utilisent des paramètres de requête)
export async function GET(request) {
    try {
        // Récupérer les paramètres de recherche
        const { searchParams } = new URL(request.url);
        const endpoint = searchParams.get('endpoint') || '';

        // Construire l'URL avec tous les paramètres de recherche originaux
        let apiUrl = `${process.env.API_OSI}/api/${endpoint}`;

        // Copier tous les paramètres de recherche sauf 'endpoint'
        const newParams = new URLSearchParams();
        for (const [key, value] of searchParams.entries()) {
            if (key !== 'endpoint') {
                newParams.append(key, value);
            }
        }

        // Ajouter les paramètres à l'URL si nécessaire
        const paramsString = newParams.toString();
        if (paramsString) {
            apiUrl += `?${paramsString}`;
        }

        // Log pour le débogage
        // console.log('Appel API GET vers:', apiUrl);

        // Effectuer la requête à l'API externe
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.API_TOKEN_OSI}`
            }
        });

        // Récupérer les données de la réponse
        let data;
        try {
            data = await response.json();
        } catch (error) {
            // Si la réponse n'est pas du JSON valide, renvoyer un objet vide
            data = {};
        }

        // Log pour le débogage
        // console.log('Réponse API GET:', response.status, data);

        // Renvoyer la réponse avec le même statut
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Erreur proxy API:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la communication avec le serveur' },
            { status: 500 }
        );
    }
} 