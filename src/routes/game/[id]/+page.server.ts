import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params, cookies }) => {
    const room = params.id;
    const player = cookies.get('player');

    if (!player) {
        cookies.set('room', params.id, { secure: false, path: '/' });
        redirect(307, '/join');
    }

    return { room, player };
};
