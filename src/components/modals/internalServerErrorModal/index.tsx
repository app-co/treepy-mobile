/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/jsx-no-bind */
import React, {
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useAuth } from '@/contexts/auth';

import InternalServerErrorModalHandler from './handler';
import { InternalServerErrorModalRef } from './types';

export function InternalServerErrorModal() {
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const ref = useRef<InternalServerErrorModalRef>();

  function handleConfirm() {
    ref.current?.hide();
  }

  function showModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  useLayoutEffect(() => {
    InternalServerErrorModalHandler.setRef(ref);
  }, []);

  useImperativeHandle(ref, () => ({
    show: showModal,
    hide: closeModal,
  }));

  return (
    <Modal
      animationType="fade"
      transparent
      visible={isOpen}
      onRequestClose={closeModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalBody}>
          <View style={styles.modalHeader}>
            <Text style={styles.title}>Ops! Algo deu errado.</Text>
          </View>

          <Text style={styles.bodyText}>
            Desculpe-nos, não foi possível processar sua solicitação no momento.
            Por favor, tente novamente mais tarde.
          </Text>

          <TouchableOpacity
            onPress={handleConfirm}
            style={[
              styles.button,
              {
                backgroundColor:
                  user?.configDenomonacaoDto?.corPrimaria || '#000',
              },
            ]}
          >
            <Text style={styles.buttonText}>Ok</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    padding: 24,
    width: '75%',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    letterSpacing: 1.28,
    color: '#434343',
    fontSize: 16,
    fontWeight: '700',
  },
  bodyText: {
    marginVertical: 16,
    color: '#7b7b7b',
    fontSize: 14,
    lineHeight: 24,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 4,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
});
