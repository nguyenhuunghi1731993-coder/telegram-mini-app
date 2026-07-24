import { supabase } from "../lib/supabase";

export async function getGirls() {
  const { data, error } = await supabase
    .from("girls")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function getGirlById(id) {
  const { data, error } = await supabase
    .from("girls")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function addGirl(girl) {
  const { data, error } = await supabase
    .from("girls")
    .insert([girl])
    .select();

  if (error) throw error;

  return data;
}