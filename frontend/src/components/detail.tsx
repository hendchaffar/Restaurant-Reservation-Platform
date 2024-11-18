import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
} from '@nextui-org/react';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
      <ModalContent className="max-w-3xl overflow-auto">
        <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
        <ModalBody className="max-h-[75vh] overflow-auto">
          {children}
        </ModalBody>{' '}
        <ModalFooter className="mt-1">
          {/* <button onClick={onClose} className="text-blue-500">
            Close
          </button> */}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DetailModal;
