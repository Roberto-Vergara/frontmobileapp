import React, { useState } from 'react';
import { 
  Modal, View, Text, TextInput, TouchableOpacity, 
  Image, StyleSheet, ScrollView, SafeAreaView 
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import * as ImagePicker from 'expo-image-picker';

export default function PantallaRechazo({ visible, item, nota, onClose, onConfirm }) {
  const [tipoDefecto, setTipoDefecto] = useState('');
  const [comentario, setComentario] = useState('');
  const [foto, setFoto] = useState(null);
  const [reposicion, setReposicion] = useState(false); // Nuevo estado para checkbox

  if (!item) return null;

  const opcionesDefectos = [
    "Vidrio rallado", "Vidrio con escalladuras", "Vidrio sucio interno",
    "Falla materia prima", "Error de fabricación", "Error datos vendedor"
  ];


  const manejarConfirmar = () => {
    if (!tipoDefecto) return alert("Selecciona un tipo de defecto");
    
    onConfirm({ 
      ...item, 
      motivoRechazo: tipoDefecto, 
      comentarioAdicional: comentario,
      idVendedor: nota.cabecera.ID_VENDEDOR.trim(),
      reposicion: reposicion 
    });

    setTipoDefecto(''); 
    setComentario(''); 
    setFoto(null);
    setReposicion(false);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.safeArea}>
        {/* CABECERA */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>REGISTRO DE RECHAZO</Text>
          <View style={{ width: 45 }} /> 
        </View>

        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* TARJETA DE DATOS TÉCNICOS */}
          <View style={styles.dataCard}>
            <View style={styles.rowJustified}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>CLIENTE / RUT</Text>
                <Text style={styles.valCliente}>{nota?.cabecera?.NOM_CLIENTE?.trim()}</Text>
                <Text style={styles.valRut}>{nota?.cabecera?.RUT_CLIENTE}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.label}>VENDEDOR</Text>
                <Text style={styles.valVendedor}>{nota?.cabecera?.ID_VENDEDOR?.trim() || 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.rowJustified}>
              <View>
                <Text style={styles.label}>ID VENTA - ÍTEM</Text>
                <Text style={styles.valId}>{item.COD_VENTA} - {item.NRO_ITEM}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.label}>MEDIDAS</Text>
                <Text style={styles.valMedida}>{item.DIM1}x{item.DIM2} <Text style={styles.unit}>mm</Text></Text>
              </View>
            </View>

            <View style={{ marginTop: 10 }}>
              <Text style={styles.label}>PLANO</Text>
              <Text style={styles.valMarca}>{item.MARCA_PIEZA?.trim() || 'SIN MARCA'}</Text>
            </View>
          </View>

          {/* FORMULARIO */}
          <View style={styles.formContainer}>
            
            {/* APARTADO DE REPOSICIÓN (CHECKBOX) */}
            <TouchableOpacity 
              style={styles.checkboxWrapper} 
              onPress={() => setReposicion(!reposicion)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, reposicion && styles.checkboxSelected]}>
                {reposicion && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <View>
                <Text style={styles.checkboxTitle}>Solicitar Reposición</Text>
                <Text style={styles.checkboxSub}>Indica si el producto debe fabricarse de nuevo</Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.formLabel}>DEFECTO DETECTADO</Text>
            <View style={styles.pickerBox}>
              <Picker selectedValue={tipoDefecto} onValueChange={(v) => setTipoDefecto(v)} style={styles.picker}>
                <Picker.Item label="Seleccione el motivo..." value="" color="#999" />
                {opcionesDefectos.map((op, i) => <Picker.Item key={i} label={op} value={op} color="#000" />)}
              </Picker>
            </View>

            <Text style={styles.formLabel}>OBSERVACIONES</Text>
            <TextInput
              style={styles.input}
              placeholder="Detalle el problema aquí..."
              placeholderTextColor="#999"
              value={comentario}
              onChangeText={setComentario}
              multiline
            />
          </View>
        </ScrollView>

        {/* BOTÓN DE ACCIÓN */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.confirmBtn} onPress={manejarConfirmar}>
            <Text style={styles.confirmBtnText}>CONFIRMAR RECHAZO</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { paddingHorizontal: 18, flex: 1 },
  
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 60, borderBottomWidth: 1, borderBottomColor: '#eee' },
  topBarTitle: { fontSize: 14, fontWeight: '900', color: '#222', letterSpacing: 0.5 },
  closeBtn: { paddingHorizontal: 20 },
  closeBtnText: { fontSize: 24, color: '#333', fontWeight: 'bold' },

  dataCard: { backgroundColor: '#f1f3f5', borderRadius: 14, padding: 15, marginTop: 15, borderLeftWidth: 6, borderLeftColor: '#1a73e8' },
  rowJustified: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  divider: { height: 1, backgroundColor: '#dee2e6', marginVertical: 12 },
  
  label: { fontSize: 10, fontWeight: 'bold', color: '#868e96', marginBottom: 3, letterSpacing: 0.5 },
  valCliente: { fontSize: 17, fontWeight: 'bold', color: '#212529' },
  valRut: { fontSize: 13, color: '#495057' },
  valVendedor: { fontSize: 15, fontWeight: 'bold', color: '#444', backgroundColor: '#e9ecef', paddingHorizontal: 6, borderRadius: 4 },
  valId: { fontSize: 20, fontWeight: 'bold', color: '#1a73e8' },
  valMedida: { fontSize: 22, fontWeight: 'bold', color: '#212529' },
  unit: { fontSize: 12, fontWeight: 'normal', color: '#868e96' },
  valMarca: { fontSize: 16, fontWeight: '600', color: '#495057' },

  // Estilos del Checkbox
  checkboxWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f8f9fa', 
    padding: 15, 
    borderRadius: 12, 
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#eee'
  },
  checkbox: { 
    width: 26, 
    height: 26, 
    borderWidth: 2, 
    borderColor: '#cbd5e0', 
    borderRadius: 6, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 12,
    backgroundColor: '#fff'
  },
  checkboxSelected: { backgroundColor: '#1a73e8', borderColor: '#1a73e8' },
  checkMark: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  checkboxTitle: { fontSize: 15, fontWeight: 'bold', color: '#2d3748' },
  checkboxSub: { fontSize: 11, color: '#718096' },

  formContainer: { marginTop: 10 },
  formLabel: { fontSize: 12, fontWeight: 'bold', color: '#343a40', marginBottom: 5, marginTop: 15 },
  pickerBox: { borderWidth: 1.5, borderColor: '#ced4da', borderRadius: 10, backgroundColor: '#fff' },
  picker: { height: 50 },
  input: { borderWidth: 1.5, borderColor: '#ced4da', borderRadius: 10, padding: 12, height: 80, textAlignVertical: 'top', backgroundColor: '#fff', fontSize: 15 },
  
  footer: { padding: 18, borderTopWidth: 1, borderTopColor: '#eee' },
  confirmBtn: { backgroundColor: '#d32f2f', padding: 18, borderRadius: 12, alignItems: 'center' },
  confirmBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 }
});