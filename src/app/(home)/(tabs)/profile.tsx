import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { StyleSheet, View, Alert } from 'react-native'
import { Button, Input } from 'react-native-elements'
import { Session } from '@supabase/supabase-js'
import { useAuth } from '../../../providers/AuthProvider'
import  Avatar from '../../../components/Avatar'
import { ScrollView } from 'react-native-gesture-handler'

export default function ProfileScreen() {
  
  const { session } = useAuth();  
    
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [fullname, setFullname] = useState('')
  const [website, setWebsite] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    if (session) getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('Nenhum usuário logado!')

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url, full_name`)
        .eq('id', session?.user.id)
        .single()
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
        setFullname(data.full_name)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
    full_name,
  }: {
    username: string
    website: string
    avatar_url: string
    full_name: string
  }) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('Nenhum usuário logado!')

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        full_name,
        updated_at: new Date(),
      }

      const { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
      <ScrollView style={styles.container}>
        <View style={{ alignItems: 'center'}}>
            <Avatar
                size={200}
                url={avatarUrl}
                onUpload={(url: string) => {
                setAvatarUrl(url)
                updateProfile({ username, website, avatar_url: url, full_name: fullname })
                }}
            />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input label="Email" value={session?.user?.email} disabled />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Username" value={username || ''} onChangeText={(text) => setUsername(text)} />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Fullname" value={fullname || ''} onChangeText={(text) => setFullname(text)} />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Website" value={website || ''} onChangeText={(text) => setWebsite(text)} />
      </View>
      
      

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? 'Atualizando...' : 'Atualizar'}
          onPress={() => updateProfile({ username, website, avatar_url: avatarUrl, full_name: fullname })}
          disabled={loading}
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Button title="Sair" onPress={() => supabase.auth.signOut()} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})