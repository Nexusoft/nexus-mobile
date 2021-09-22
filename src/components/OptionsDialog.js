import React from 'react';
import { FlatList, SectionList } from 'react-native';
import { TouchableRipple, List } from 'react-native-paper';

import Dialog from 'components/Dialog';
import Portal from 'components/Portal';
import Divider from 'components/Divider';

const defaultRenderList = (items) => items;
const defaultKeyExtractor = (item, index) => String(index);

export default function OptionsDialog({
  sectioned,
  title,
  options,
  renderList = defaultRenderList,
  renderOption,
  keyExtractor = defaultKeyExtractor,
  onDismiss,
  onSelect,
  ...rest
}) {
  const ListComponent = sectioned ? SectionList : FlatList;
  return (
    <Portal>
      <Dialog visible onDismiss={onDismiss} {...rest}>
        {!!title && <Dialog.Title>{title}</Dialog.Title>}
        <Dialog.ScrollArea>
          {renderList(
            <ListComponent
              sections={options}
              data={options}
              renderItem={({ item: option, index, section }) => (
                <TouchableRipple
                  onPress={() => {
                    const preventClosing = onSelect?.(option);
                    if (preventClosing !== false) {
                      onDismiss?.();
                    }
                  }}
                >
                  {renderOption(option, { index, section })}
                </TouchableRipple>
              )}
              SectionSeparatorComponent={Divider}
              keyExtractor={keyExtractor}
              renderSectionHeader={
                sectioned
                  ? ({ section }) => (
                      <List.Subheader style={{ marginTop: 20 }}>
                        {section.key}
                      </List.Subheader>
                    )
                  : undefined
              }
              stickySectionHeadersEnabled
            />
          )}
        </Dialog.ScrollArea>
      </Dialog>
    </Portal>
  );
}
