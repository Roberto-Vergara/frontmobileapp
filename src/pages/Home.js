import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/Home.style';
import FormRechazo from '../components/FormRechazo';
import ListaRechazos from '../components/ListaRechazos';

export default function Home() {
  const [view, setView] = useState('rechazar'); // 'rechazar' o 'ver'
  const [historial, setHistorial] = useState([]);

  const addRechazo = (nuevo) => {
    setHistorial([{ ...nuevo, fecha: new Date().toLocaleString() }, ...historial]);
  };

  return (
    <View style={styles.container}>
      {/* TABS DE SECCIÓN */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.tabButton, view === 'rechazar' && styles.activeTab]} 
          onPress={() => setView('rechazar')}
        >
          <Text style={[styles.tabText, view === 'rechazar' && styles.activeTabText]}>RECHAZAR</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabButton, view === 'ver' && styles.activeTab]} 
          onPress={() => setView('ver')}
        >
          <Text style={[styles.tabText, view === 'ver' && styles.activeTabText]}>HISTORIAL</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.content,{flex:1}]}>
        {view === 'rechazar' ? (
          <FormRechazo onSave={addRechazo} />
        ) : (
          <ListaRechazos historial={historial} />
        )}
      </View>
    </View>
  );
}