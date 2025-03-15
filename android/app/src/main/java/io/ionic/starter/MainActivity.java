package io.ionic.starter;
import io.ionic.starter.UWBPlugin;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        registerPlugin(UWBPlugin.class);
    }
}
