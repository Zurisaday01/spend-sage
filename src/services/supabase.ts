import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://flcjwuzraxhilfybvtuv.supabase.co';

const supabaseKey =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsY2p3dXpyYXhoaWxmeWJ2dHV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA4NDE0NDIsImV4cCI6MjAxNjQxNzQ0Mn0.iqElgTikY8pjQWGL1voS0zOh48qMVeYtFYJl5iMfj4I';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
