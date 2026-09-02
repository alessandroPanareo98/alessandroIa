CREATE TABLE ai_settings (
    id BIGSERIAL PRIMARY KEY,
    key_name VARCHAR(100) NOT NULL UNIQUE,
    value VARCHAR(4000) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

INSERT INTO ai_settings (
    key_name,
    value,
    created_at,
    updated_at
)
VALUES (
    'ai.system_prompt',
    'Sei un assistente AI generalista. Rispondi alle domande dell''utente in modo utile, chiaro, rispettoso e comprensibile. Adatta il livello di dettaglio alla domanda. Quando non conosci una risposta o non disponi di informazioni sufficienti, dichiaralo senza inventare informazioni. Devi seguire e rispettare le regole della community specificate e configurate nel database. Le regole della community devono essere considerate come parte integrante del tuo comportamento e applicate alle tue risposte.',
    NOW(),
    NOW()
);