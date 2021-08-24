import React from 'react';
import { FlatList, ScrollView } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

import Dialog from 'components/Dialog';
import Portal from 'components/Portal';

const defaultRenderList = (items) => items;
const defaultKeyExtractor = (item, index) => String(index);

export default function OptionsDialog({
  title,
  options,
  renderList = defaultRenderList,
  renderOption,
  ItemSeparatorComponent,
  keyExtractor = defaultKeyExtractor,
  onDismiss,
  onSelect,
  ...rest
}) {
  return (
    <Portal>
      <Dialog visible onDismiss={onDismiss} {...rest}>
        {!!title && <Dialog.Title>{title}</Dialog.Title>}
        <Dialog.ScrollArea>
          {renderList(
            <FlatList
              data={options}
              renderItem={({ item: option, index }) => (
                <TouchableRipple
                  onPress={() => {
                    const preventClosing = onSelect?.(option);
                    if (preventClosing !== false) {
                      onDismiss?.();
                    }
                  }}
                >
                  {renderOption(option, index)}
                </TouchableRipple>
              )}
              ItemSeparatorComponent={ItemSeparatorComponent}
              keyExtractor={keyExtractor}
            />
          )}
        </Dialog.ScrollArea>
      </Dialog>
    </Portal>
  );
}
