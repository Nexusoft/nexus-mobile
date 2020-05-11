import React from "react";
import { TouchableRipple } from "react-native-paper";
import styled from "@emotion/native";

import { Text } from "components/StyledText";
import Switch from "components/Switch";
import Divider from "components/Divider";

const Wrapper = styled.View({
  flex: 1,
  paddingVertical: 30,
});

const SettingDivider = styled(Divider)({
  marginHorizontal: 20,
});

const Setting = styled.View({
  paddingVertical: 20,
  paddingHorizontal: 20,
  flexDirection: "row",
  alignItems: "center",
});

const SettingText = styled.View({
  flex: 1,
  paddingRight: 10,
});

const StyledSettingLabel = styled(Text)({
  fontSize: 18,
});

const SettingLabel = (props) => <StyledSettingLabel emphasis {...props} />;

const SettingDescription = styled(Text)({
  fontSize: 14,
  marginTop: 3,
});

const SettingSwitch = styled.View(({ theme }) => ({
  paddingHorizontal: 10,
  // borderLeftWidth: 0.5,
  // borderLeftColor: theme.foreground,
  // borderLeftStyle: "solid",
}));

export default function ApplicationSettings() {
  return (
    <Wrapper>
      <TouchableRipple borderless={false} onPress={() => {}}>
        <Setting>
          <SettingText>
            <SettingLabel>Dark mode</SettingLabel>
            <SettingDescription primary>On</SettingDescription>
          </SettingText>
          <SettingSwitch>
            <Switch value={true} />
          </SettingSwitch>
        </Setting>
      </TouchableRipple>
      <SettingDivider />
      <TouchableRipple borderless={false} onPress={() => {}}>
        <Setting>
          <SettingText>
            <SettingLabel>Send anonymous usage data</SettingLabel>
            <SettingDescription>
              Send anonymous usage data to allow the Nexus developers to improve
              the wallet.
            </SettingDescription>
          </SettingText>
          <SettingSwitch>
            <Switch value={true} />
          </SettingSwitch>
        </Setting>
      </TouchableRipple>
    </Wrapper>
  );
}
