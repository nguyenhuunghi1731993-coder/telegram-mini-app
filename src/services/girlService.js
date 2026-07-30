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

  if (error) return null;

  return data;
}

export async function addGirl(girl) {
  const { data, error } = await supabase
    .from("girls")
    .insert(girl)
    .select();

  if (error) throw error;

  return data;
}
export async function deleteGirl(id) {
  const { error } = await supabase
    .from("girls")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
export async function updateGirl(id, girl) {
  const { data, error } = await supabase
    .from("girls")
    .update(girl)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function uploadImage(file) {
  const fileName = `${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from("girls")
    .upload(fileName, file);

  console.log("========== UPLOAD ==========");
  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) {
    console.error("UPLOAD ERROR:", error);
    throw error;
  }

  const { data: publicData } = supabase.storage
    .from("girls")
    .getPublicUrl(fileName);

  console.log("PUBLIC URL:", publicData.publicUrl);

  return publicData.publicUrl;
}
export async function uploadVideo(file) {
  const fileExt = file.name.split(".").pop();

  const fileName = `videos/${Date.now()}-${Math.random()
    .toString(36)
    .substring(2)}.${fileExt}`;

  const { error } = await supabase.storage
    .from("girls")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from("girls")
    .getPublicUrl(fileName);

  return data.publicUrl;
}
// =========================
// GET STORAGE PATH FROM URL
// =========================

export function getStoragePathFromUrl(url) {
  if (!url) return null;

  try {
    const marker = "/storage/v1/object/public/girls/";
    const index = url.indexOf(marker);

    if (index === -1) return null;

    return decodeURIComponent(
      url.substring(index + marker.length)
    );
  } catch (error) {
    console.error("Invalid storage URL:", error);
    return null;
  }
}


// =========================
// DELETE STORAGE FILE
// =========================

export async function deleteStorageFile(url) {
  const path = getStoragePathFromUrl(url);

  if (!path) {
    console.warn("Storage path not found:", url);
    return;
  }

  const { error } = await supabase.storage
    .from("girls")
    .remove([path]);

  if (error) throw error;
}