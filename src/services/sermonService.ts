import { supabase } from '../lib/supabase';
import type { DbSermon } from '../lib/supabase';
import type { Sermon } from '../types';

// Convert database sermon to app sermon type
function toSermon(db: DbSermon): Sermon {
  return {
    id: db.id,
    title: db.title,
    datePreached: db.date_preached,
    pastorName: db.pastor_name,
    scriptureReferences: db.scripture_references,
    videoUrl: db.video_url || undefined,
    summary: db.summary || '',
    keyTopics: db.key_topics,
    mainVerses: db.main_verses,
    keyTakeaways: db.key_takeaways,
    thumbnailUrl: db.thumbnail_url || undefined,
    seriesId: db.series_id || undefined,
    seriesName: db.series_name || undefined,
    viewCount: db.view_count,
    duration: db.duration || undefined,
    status: db.status as 'draft' | 'published'
  };
}

// Convert app sermon to database format
function toDbSermon(sermon: Omit<Sermon, 'id'>): Omit<DbSermon, 'id' | 'created_at'> {
  return {
    title: sermon.title,
    date_preached: sermon.datePreached,
    pastor_name: sermon.pastorName,
    scripture_references: sermon.scriptureReferences,
    video_url: sermon.videoUrl || null,
    summary: sermon.summary,
    key_topics: sermon.keyTopics,
    main_verses: sermon.mainVerses || [],
    key_takeaways: sermon.keyTakeaways,
    thumbnail_url: sermon.thumbnailUrl || null,
    series_id: sermon.seriesId || null,
    series_name: sermon.seriesName || null,
    view_count: sermon.viewCount || 0,
    duration: sermon.duration || null,
    status: sermon.status || 'published'
  };
}

export const sermonService = {
  // Get all sermons
  async getSermons(): Promise<Sermon[]> {
    const { data, error } = await supabase
      .from('sermons')
      .select('*')
      .order('date_preached', { ascending: false });

    if (error) {
      console.error('Error fetching sermons:', error);
      throw error;
    }

    return (data || []).map(toSermon);
  },

  // Get a single sermon by ID
  async getSermonById(id: string): Promise<Sermon | null> {
    const { data, error } = await supabase
      .from('sermons')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      console.error('Error fetching sermon:', error);
      throw error;
    }

    return data ? toSermon(data) : null;
  },

  // Add a new sermon (admin only)
  async addSermon(sermon: Omit<Sermon, 'id'>): Promise<Sermon> {
    const { data, error } = await supabase
      .from('sermons')
      .insert([toDbSermon(sermon)])
      .select()
      .single();

    if (error) {
      console.error('Error adding sermon:', error);
      throw error;
    }

    return toSermon(data);
  },

  // Update a sermon (admin only)
  async updateSermon(id: string, sermon: Partial<Sermon>): Promise<Sermon> {
    const updateData: Record<string, unknown> = {};
    
    if (sermon.title) updateData.title = sermon.title;
    if (sermon.datePreached) updateData.date_preached = sermon.datePreached;
    if (sermon.pastorName) updateData.pastor_name = sermon.pastorName;
    if (sermon.scriptureReferences) updateData.scripture_references = sermon.scriptureReferences;
    if (sermon.videoUrl !== undefined) updateData.video_url = sermon.videoUrl;
    if (sermon.summary) updateData.summary = sermon.summary;
    if (sermon.keyTopics) updateData.key_topics = sermon.keyTopics;
    if (sermon.mainVerses) updateData.main_verses = sermon.mainVerses;
    if (sermon.keyTakeaways) updateData.key_takeaways = sermon.keyTakeaways;
    if (sermon.thumbnailUrl !== undefined) updateData.thumbnail_url = sermon.thumbnailUrl;
    if (sermon.seriesId !== undefined) updateData.series_id = sermon.seriesId;
    if (sermon.seriesName !== undefined) updateData.series_name = sermon.seriesName;
    if (sermon.status) updateData.status = sermon.status;

    const { data, error } = await supabase
      .from('sermons')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating sermon:', error);
      throw error;
    }

    return toSermon(data);
  },

  // Delete a sermon (admin only)
  async deleteSermon(id: string): Promise<void> {
    const { error } = await supabase
      .from('sermons')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting sermon:', error);
      throw error;
    }
  },

  // Increment view count
  async incrementViewCount(id: string): Promise<void> {
    const { error } = await supabase.rpc('increment_view_count', { sermon_id: id });
    
    if (error) {
      // Fallback: fetch and update
      const { data } = await supabase.from('sermons').select('view_count').eq('id', id).single();
      if (data) {
        await supabase.from('sermons').update({ view_count: data.view_count + 1 }).eq('id', id);
      }
    }
  }
};
