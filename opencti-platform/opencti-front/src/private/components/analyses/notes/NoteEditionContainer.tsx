import React, { FunctionComponent } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import Drawer, { DrawerControlledDialType, DrawerVariant } from '@components/common/drawer/Drawer';
import useHelper from 'src/utils/hooks/useHelper';
import { useFormatter } from '../../../../components/i18n';
import NoteEditionOverview from './NoteEditionOverview';
import { NoteEditionContainer_note$data } from './__generated__/NoteEditionContainer_note.graphql';

interface NoteEditionContainerProps {
  note: NoteEditionContainer_note$data
  handleClose: () => void
  open?: boolean
  controlledDial?: DrawerControlledDialType
}

const NoteEditionContainer: FunctionComponent<NoteEditionContainerProps> = ({
  note,
  handleClose,
  open,
  controlledDial,
}) => {
  const { t_i18n } = useFormatter();
  const { isFeatureEnable } = useHelper();
  const isFABReplaced = isFeatureEnable('FAB_REPLACEMENT');

  const { editContext } = note;

  return (
    <Drawer
      title={t_i18n('Update a note')}
      variant={!isFABReplaced && open == null ? DrawerVariant.update : undefined}
      context={editContext}
      onClose={handleClose}
      open={open}
      controlledDial={isFABReplaced ? controlledDial : undefined}
    >
      {({ onClose }) => (
        <NoteEditionOverview
          note={note}
          context={editContext}
          handleClose={onClose}
        />
      )}
    </Drawer>
  );
};

const NoteEditionContainerFragment = createFragmentContainer(
  NoteEditionContainer,
  {
    note: graphql`
      fragment NoteEditionContainer_note on Note {
        ...NoteEditionOverview_note
        editContext {
          name
          focusOn
        }
      }
    `,
  },
);

export default NoteEditionContainerFragment;
