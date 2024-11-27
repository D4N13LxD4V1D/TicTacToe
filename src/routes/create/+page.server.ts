import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

import { randomInt } from 'crypto';

export const load: PageServerLoad = ({ cookies }) => {
    return {
        room: randomInt(100000, 999999),
        player: cookies.get('player')
    }
};

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();

        const player = data.get('player');
        const room = data.get('room');

        if (!player || (player && typeof player !== 'string')) return fail(400, { player });

        cookies.set('player', player, { secure: false, path: '/' });

        redirect(307, `/game/${room}`);
    }
} satisfies Actions;
