import React from 'react';
import { View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';

import CommonStyles from 'src/styles/CommonStyles';

export default locals => {
  if (locals.hidden) {
    return null;
  }

  return (
    <View style={CommonStyles.containerItem}>
      <TextInput
        mode="outlined"
        label={locals.label}
        accessibilityLabel={locals.label}
        allowFontScaling={locals.allowFontScaling}
        autoCapitalize={locals.autoCapitalize}
        autoCorrect={locals.autoCorrect}
        autoFocus={locals.autoFocus}
        blurOnSubmit={locals.blurOnSubmit}
        clearButtonMode={locals.clearButtonMode}
        clearTextOnFocus={locals.clearTextOnFocus}
        editable={locals.editable}
        enablesReturnKeyAutomatically={locals.enablesReturnKeyAutomatically}
        keyboardAppearance={locals.keyboardAppearance}
        keyboardType={locals.keyboardType}
        maxLength={locals.maxLength}
        multiline={locals.multiline}
        numberOfLines={locals.numberOfLines}
        onBlur={locals.onBlur}
        onChange={locals.onChangeNative}
        onChangeText={value => locals.onChange(value)}
        onContentSizeChange={locals.onContentSizeChange}
        onEndEditing={locals.onEndEditing}
        onFocus={locals.onFocus}
        onKeyPress={locals.onKeyPress}
        onLayout={locals.onLayout}
        onSelectionChange={locals.onSelectionChange}
        onSubmitEditing={locals.onSubmitEditing}
        placeholder={locals.placeholder}
        placeholderTextColor={locals.placeholderTextColor}
        ref="input"
        returnKeyType={locals.returnKeyType}
        secureTextEntry={locals.secureTextEntry}
        selectTextOnFocus={locals.selectTextOnFocus}
        selectionColor={locals.selectionColor}
        selectionState={locals.selectionState}
        testID={locals.testID}
        textContentType={locals.textContentType}
        value={locals.value}
      />
      {/*<HelperText type="error" visible={locals.hasError && locals.error}>*/}
        {/*{locals.error}*/}
      {/*</HelperText>*/}
    </View>
  );
};
