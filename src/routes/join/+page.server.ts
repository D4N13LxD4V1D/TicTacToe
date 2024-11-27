import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = ({ cookies }) => {
    return {
        room: cookies.get('room'),
        player: cookies.get('player'),
    }
}

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();

        const player = data.get('player') as string;
        const room = data.get('room') as string;

        if (!player || !room) return fail(400, { player, room });

        cookies.set('player', player, { secure: false, path: '/' });

        redirect(307, `/game/${room}`);
    }
} satisfies Actions;
