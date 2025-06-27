import React from "react";
import {
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CButton,
} from "@coreui/react";

const UnlinkModal = ({ visible, onClose, platform, onUnlink }) => {
  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>Are you sure?</CModalHeader>
      <CModalBody>
        Do you really want to unlink your {platform} account? You will need to re-link it later if needed.
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Cancel
        </CButton>
        <CButton color="danger" onClick={onUnlink}>
          Unlink
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default UnlinkModal;
