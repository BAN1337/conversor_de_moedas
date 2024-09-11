import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, StatusBar, ActivityIndicator, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { PickerItem } from './src/Piker';
import { api } from './src/services/api';

export default function App() {
  const [loading, setLoading] = useState(true)
  const [moedas, setMoedas] = useState([])
  const [moedaSelecionada, setMoedaSelecionada] = useState(null)
  const [valorMoeda, setValorMoeda] = useState('')

  const [siglaMoeda, setSiglaMoeda] = useState('')
  const [valorDigitado, setValorDigitado] = useState('')
  const [valorConvertido, setValorConvertido] = useState(0)

  useEffect(() => {
    async function loadMoedas() {
      const response = await api.get('all')
      let arrayMoedas = []
      Object.keys(response.data).map(key => {
        arrayMoedas.push({
          key: key,
          label: key,
          value: key
        })
      })

      console.log(arrayMoedas)
      setMoedas(arrayMoedas)
      setMoedaSelecionada(arrayMoedas[0].key)
      setLoading(false)
    }

    loadMoedas()
  }, [])

  async function converter() {
    if (valorMoeda === 0 || valorMoeda === '' || moedaSelecionada === null) {
      return
    }

    const response = await api.get(`/all/${moedaSelecionada}-BRL`)

    let resultado = (response.data[moedaSelecionada].ask * parseFloat(valorMoeda))

    setValorConvertido(`${resultado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`)
    setSiglaMoeda(moedaSelecionada)
    setValorDigitado(valorMoeda)
    Keyboard.dismiss()
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#101215' }}>
        <ActivityIndicator color='#fff' size='large' />
      </View>
    )
  } else {
    return (
      <View style={styles.container}>
        <StatusBar />

        <View style={styles.areaMoeda}>
          <Text style={styles.titulo}>Selecione sua moeda</Text>
          <PickerItem
            moedas={moedas}
            moedaSelecionada={moedaSelecionada}
            onChange={(moeda) => setMoedaSelecionada(moeda)}
          />
        </View >

        <View style={styles.areaValor}>
          <Text style={styles.titulo}>Digite um valor para converter em (R$)</Text>

          <TextInput
            placeholder='EX: 1.50'
            style={styles.input}
            keyboardType='numeric'
            value={valorMoeda}
            onChangeText={(valor) => setValorMoeda(valor)}
          />
        </View>

        <TouchableOpacity style={styles.botaoArea} onPress={converter}>
          <Text style={styles.botaoText}>Converter</Text>
        </TouchableOpacity>

        {valorConvertido !== 0 && (
          <View style={styles.areaResultado}>
            <Text style={styles.valorConvertido}>
              {valorDigitado} {siglaMoeda}
            </Text>

            <Text style={{ fontSize: 18, margin: 8 }}>
              corresponde a
            </Text>

            <Text style={styles.valorConvertido}>
              {valorConvertido}
            </Text>
          </View>
        )}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101215',
    paddingTop: 40,
    alignItems: 'center'
  },
  areaMoeda: {
    backgroundColor: '#f9f9f9',
    width: '90%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 8,
    marginBottom: 1
  },
  titulo: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    paddingLeft: 5,
    paddingTop: 5
  },
  areaValor: {
    backgroundColor: '#f9f9f9',
    width: '90%',
    padding: 8
  },
  input: {
    width: '100%',
    padding: 8,
    fontSize: 18,
    color: '#000'
  },
  botaoArea: {
    width: '90%',
    backgroundColor: '#fb4b57',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8
  },
  botaoText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16
  },
  areaResultado: {
    width: '90%',
    backgroundColor: '#fff',
    marginTop: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  valorConvertido: {
    fontSize: 28,
    color: '#000',
    fontWeight: 'bold'
  }
});