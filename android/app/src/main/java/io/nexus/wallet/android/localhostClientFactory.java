package io.nexus.wallet.android;

import android.util.Log;

import com.facebook.react.modules.network.OkHttpClientFactory;
import com.facebook.react.modules.network.ReactCookieJarContainer;

import java.io.IOException;
import java.net.InetAddress;
import java.net.Socket;
import java.security.KeyStore;
import java.security.cert.X509Certificate;
import java.util.concurrent.TimeUnit;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.TrustManagerFactory;
import javax.net.ssl.X509TrustManager;

import okhttp3.OkHttpClient;

// Http client for the app: self signed certificates are accepted only for the
// phone itself and private network addresses (the embedded core and a core on
// the user's own LAN). Every other host gets the normal certificate checks.
public class localhostClientFactory implements OkHttpClientFactory {
    private static final String TAG = "NEXUS::LOCALHOST::OkHttpClientFactory";
    private static final int connectTimeoutSecs = 20;
    private static final int readTimeoutSecs = 90;

    static boolean isLocalHost(String host) {
        if (host == null) return false;
        String h = host.toLowerCase();
        if (h.equals("localhost") || h.equals("::1") || h.endsWith(".local")) return true;
        if (h.startsWith("127.") || h.startsWith("10.") || h.startsWith("192.168.")) return true;
        if (h.startsWith("172.")) {
            String[] parts = h.split("\\.");
            if (parts.length > 1) {
                try {
                    int second = Integer.parseInt(parts[1]);
                    return second >= 16 && second <= 31;
                } catch (NumberFormatException e) {
                    return false;
                }
            }
        }
        return false;
    }

    //picks the trust-all factory only for local hosts, by the host OkHttp connects to
    private static class HostAwareSocketFactory extends SSLSocketFactory {
        private final SSLSocketFactory system;
        private final SSLSocketFactory local;

        HostAwareSocketFactory(SSLSocketFactory system, SSLSocketFactory local) {
            this.system = system;
            this.local = local;
        }

        private SSLSocketFactory pick(String host) {
            return isLocalHost(host) ? local : system;
        }

        @Override
        public String[] getDefaultCipherSuites() {
            return system.getDefaultCipherSuites();
        }

        @Override
        public String[] getSupportedCipherSuites() {
            return system.getSupportedCipherSuites();
        }

        @Override
        public Socket createSocket(Socket s, String host, int port, boolean autoClose) throws IOException {
            return pick(host).createSocket(s, host, port, autoClose);
        }

        @Override
        public Socket createSocket(String host, int port) throws IOException {
            return pick(host).createSocket(host, port);
        }

        @Override
        public Socket createSocket(String host, int port, InetAddress localHost, int localPort) throws IOException {
            return pick(host).createSocket(host, port, localHost, localPort);
        }

        @Override
        public Socket createSocket(InetAddress host, int port) throws IOException {
            return system.createSocket(host, port);
        }

        @Override
        public Socket createSocket(InetAddress address, int port, InetAddress localAddress, int localPort) throws IOException {
            return system.createSocket(address, port, localAddress, localPort);
        }
    }

    private static final X509TrustManager trustAll = new X509TrustManager() {
        @Override
        public void checkClientTrusted(X509Certificate[] chain, String authType) {
        }

        @Override
        public void checkServerTrusted(X509Certificate[] chain, String authType) {
        }

        @Override
        public X509Certificate[] getAcceptedIssuers() {
            return new X509Certificate[]{};
        }
    };

    private static X509TrustManager systemTrustManager() throws Exception {
        TrustManagerFactory factory = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
        factory.init((KeyStore) null);
        for (TrustManager tm : factory.getTrustManagers()) {
            if (tm instanceof X509TrustManager) return (X509TrustManager) tm;
        }
        throw new IllegalStateException("No system X509TrustManager");
    }

    @Override
    public OkHttpClient createNewNetworkModuleClient() {
        try {
            final X509TrustManager trustManager = systemTrustManager();
            final SSLContext systemContext = SSLContext.getInstance("TLS");
            systemContext.init(null, new TrustManager[]{trustManager}, new java.security.SecureRandom());
            final SSLContext localContext = SSLContext.getInstance("TLS");
            localContext.init(null, new TrustManager[]{trustAll}, new java.security.SecureRandom());
            final HostnameVerifier defaultVerifier = HttpsURLConnection.getDefaultHostnameVerifier();

            OkHttpClient.Builder builder = new OkHttpClient.Builder()
                    .connectTimeout(connectTimeoutSecs, TimeUnit.SECONDS)
                    .readTimeout(readTimeoutSecs, TimeUnit.SECONDS)
                    .writeTimeout(readTimeoutSecs, TimeUnit.SECONDS)
                    .cookieJar(new ReactCookieJarContainer());
            builder.sslSocketFactory(
                    new HostAwareSocketFactory(systemContext.getSocketFactory(), localContext.getSocketFactory()),
                    trustManager);
            builder.hostnameVerifier(new HostnameVerifier() {
                @Override
                public boolean verify(String hostname, SSLSession session) {
                    return isLocalHost(hostname) || defaultVerifier.verify(hostname, session);
                }
            });
            return builder.build();
        } catch (Exception e) {
            Log.e(TAG, e.getMessage());
            throw new RuntimeException(e);
        }
    }
}
