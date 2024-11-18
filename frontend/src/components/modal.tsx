import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

export default function CustomModal(props: {
  title: string;
  openButtonName: string;
  submitButtonName: string;
  cancelButtonName: string;
  children: JSX.Element;
  handleSubmit:(()=>void) ;
  handleCancel:()=>void;
  disabled:boolean,
  disabledMainButton?:boolean;
}) {
  const {
    openButtonName,
    submitButtonName,
    title,
    cancelButtonName,
    children,
    handleCancel,
    handleSubmit,
    disabled,
    disabledMainButton,
  } = props;

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button onPress={onOpen} color="primary" isDisabled={disabledMainButton==true}>
        {openButtonName}
      </Button>
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="w-[50vw] max-w-[1200px] max-h-[90vh] overflow-y-auto p-5"
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex ">{title}</ModalHeader>
              <ModalBody className="max-h-[70vh] overflow-y-auto">
                {children}
              </ModalBody>
              <ModalFooter>
              <Button color="primary" variant="shadow" isDisabled={!disabled} onClick={handleSubmit} onPress={onClose} >
                  {submitButtonName}
                </Button>
                <Button color="danger" variant="shadow" onClick={handleCancel} onPress={onClose}>
                  {cancelButtonName}
                </Button>
               
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
