import { createClient } from '@supabase/supabase-js'

function createSupabaseClient(url?: string, key?: string) {
	if (!url || !key) {
		throw new Error('Supabase environment variables are missing')
	}

	return createClient(url, key)
}

export function getSupabaseClient() {
	return createSupabaseClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
}

export function getSupabaseService() {
	return createSupabaseClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
}
