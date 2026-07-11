import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Pressable, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

export default function HomeScreen() {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Belajar React Native', status: 'Selesai' },
    { id: '2', title: 'Integrasi dengan API Laravel', status: 'Dalam Proses' },
    { id: '3', title: 'Membuat Desain Figma', status: 'Selesai' },
    { id: '4', title: 'Review Portofolio Magang', status: 'Belum Dimulai' },
  ]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  const addTask = () => {
    if (newTask.trim() === '') {
      if (Platform.OS === 'web') {
        window.alert('Tulis tugas kamu terlebih dahulu ya!');
      } else {
        alert('Tulis tugas kamu terlebih dahulu ya!');
      }
      return;
    }
    setTasks([
      ...tasks,
      { id: Date.now().toString(), title: newTask, status: 'Belum Dimulai' }
    ]);
    setNewTask('');
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          const newStatus = 
            task.status === 'Selesai' ? 'Belum Dimulai' :
            task.status === 'Belum Dimulai' ? 'Dalam Proses' : 'Selesai';
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const renderStatusBadge = (status: string) => {
    let backgroundColor = '#f1f5f9';
    let color = '#64748b';
    if (status === 'Selesai') {
      backgroundColor = '#dcfce7';
      color = '#16a34a';
    } else if (status === 'Dalam Proses') {
      backgroundColor = '#dbeafe';
      color = '#2563eb';
    } else if (status === 'Belum Dimulai') {
      backgroundColor = '#fef9c3';
      color = '#ca8a04';
    }

    return (
      <View style={[styles.statusBadge, { backgroundColor }]}>
        <Text style={[styles.statusText, { color }]}>{status}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Task Manager</Text>
          <Text style={styles.headerSubtitle}>Kelola tugas harianmu dengan mudah</Text>
        </View>
        
        <FlatList
          data={tasks}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.taskCard}>
              <View style={styles.taskContent}>
                <Pressable 
                  style={[
                    styles.checkbox, 
                    item.status === 'Selesai' && styles.checkboxChecked
                  ]}
                  onPress={() => toggleTaskStatus(item.id)}
                  {...(Platform.OS === 'web' ? { onClick: () => toggleTaskStatus(item.id) } as any : {})}
                >
                  {item.status === 'Selesai' && (
                    <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16}}>✓</Text>
                  )}
                </Pressable>
                <View style={styles.taskDetails}>
                  <Text style={[
                    styles.taskTitle,
                    item.status === 'Selesai' && styles.taskTitleDone
                  ]}>
                    {item.title}
                  </Text>
                  {renderStatusBadge(item.status)}
                </View>
              </View>
              <Pressable 
                style={styles.deleteBtn}
                onPress={() => deleteTask(item.id)}
                {...(Platform.OS === 'web' ? { onClick: () => deleteTask(item.id) } as any : {})}
              >
                <Text style={{color: '#ef4444', fontSize: 16, fontWeight: 'bold'}}>✕</Text>
              </Pressable>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={{fontSize: 40}}>📝</Text>
              <Text style={styles.emptyText}>Belum ada tugas.</Text>
            </View>
          }
        />

        {Platform.OS === 'web' ? (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Tambah tugas baru..."
              value={newTask}
              onChangeText={setNewTask}
              onSubmitEditing={addTask}
              placeholderTextColor="#94a3b8"
            />
            <Pressable 
              style={styles.addBtn} 
              onPress={addTask}
              {...(Platform.OS === 'web' ? { onClick: addTask } as any : {})}
            >
              <Text style={{color: 'white', fontSize: 24, fontWeight: 'bold'}}>+</Text>
            </Pressable>
          </View>
        ) : (
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.inputContainer}
          >
            <TextInput
              style={styles.input}
              placeholder="Tambah tugas baru..."
              value={newTask}
              onChangeText={setNewTask}
              onSubmitEditing={addTask}
              placeholderTextColor="#94a3b8"
            />
            <Pressable 
              style={styles.addBtn} 
              onPress={addTask}
              {...(Platform.OS === 'web' ? { onClick: addTask } as any : {})}
            >
              <Text style={{color: 'white', fontSize: 24, fontWeight: 'bold'}}>+</Text>
            </Pressable>
          </KeyboardAvoidingView>
        )}

        <StatusBar style="dark" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 20,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    ...Platform.select({
      web: {
        marginTop: 40,
        marginBottom: 40,
        borderRadius: 40,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        borderWidth: 8,
        borderColor: '#334155',
        overflow: 'hidden',
      }
    })
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  listContainer: {
    paddingBottom: 20,
  },
  taskCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#ffffff',
  },
  checkboxChecked: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  taskDetails: {
    flex: 1,
    marginRight: 10,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingTop: 10,
    backgroundColor: '#f8fafc',
  },
  input: {
    flex: 1,
    backgroundColor: '#ffffff',
    height: 54,
    borderRadius: 27,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  addBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#94a3b8',
    fontWeight: '500',
  }
});
