
import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.Arrays;
import java.util.Base64;

public class AES {

    private static final String algorithm = "AES/CBC/PKCS5Padding";
    private static final String AES = "AES";
    private static final String encoding = "UTF-8";
    private static final int VERSION_SIZE = 1;
    private static final int IV_SIZE = 16;
    private static final byte VERSION_NO_IV = 0x02;
    private static final byte VERSION = 0x03;
    private static final String UTF_8 = "UTF-8";

    private String encode64(byte[] binaryData) {
        return Base64.getEncoder().encodeToString(binaryData);
    }

    private byte[] decode64(String encoded) throws Exception {
        return Base64.getDecoder().decode(encoded.getBytes(UTF_8));
    }

    /**
     * Return a byte array that holds Version(first byte), IV (1-16 bytes inclusive), and Encrypted data (rest of the
     * bytes)
     * @param cipher
     * @param data
     * @return
     * @throws SecurityException
     */
    private byte[] encrypt(Cipher cipher, byte[] data) throws SecurityException {
        if (data == null) { return null; }

        byte[] iv = cipher.getIV();
        int ivSize = IV_SIZE;
        byte version = VERSION;

        final int offset = VERSION_SIZE + ivSize;
        final int outputSize = cipher.getOutputSize(data.length);
        final byte[] output = new byte[outputSize + offset];
        int length;

        try {
            cipher.doFinal(data, 0, data.length, output, offset);
            output[0] = version;
            if (ivSize > 0) { System.arraycopy(iv, 0, output, VERSION_SIZE, ivSize); }
            return output;
        } catch (SecurityException e) {
            throw e;
        } catch (Exception e) {
            throw new SecurityException(e);
        }
    }

    private Cipher encryptingCipher(final Key key) throws SecurityException {
        try {
            Cipher cipher = Cipher.getInstance(algorithm);
            cipher.init(Cipher.ENCRYPT_MODE, key);
            return cipher;
        } catch (SecurityException e) {
            throw e;
        } catch (Exception e) {
            throw new SecurityException(e);
        }
    }

    private byte[] encrypt(Key key, byte[] data) throws SecurityException {
        return encrypt(encryptingCipher(key), data);

    }

    private String encryptString(Key key, String data) throws SecurityException {
        try {
            if (data == null) { return null; }
            if (data.isEmpty()) { return data; }
            return encode64(encrypt(key, data.getBytes(encoding)));
        } catch (Exception e) {
            throw new SecurityException(e);
        }
    }

    private Cipher decryptingCipher(final Key key, final byte[] iv) throws SecurityException {
        try {
            Cipher cipher = Cipher.getInstance(algorithm);
            if (iv == null) { cipher.init(Cipher.DECRYPT_MODE, key); } else {
                cipher.init(Cipher.DECRYPT_MODE, key, new IvParameterSpec(iv));
            }
            return cipher;
        } catch (SecurityException e) {
            throw e;
        } catch (Exception e) {
            throw new SecurityException(e);
        }
    }

    private byte[] rawDecrypt(Key key, byte[] encrypted) throws SecurityException {
        if (encrypted == null) { return null; }
        if (encrypted.length == 0) { return encrypted; }

        if (encrypted.length < VERSION_SIZE) { throw new IllegalArgumentException("given data has no version."); }

        int offset;
        if (encrypted[0] == VERSION) { offset = VERSION_SIZE + IV_SIZE; } else if (encrypted[0] == VERSION_NO_IV) {
            offset = VERSION_SIZE;
        } else {
            throw new IllegalArgumentException("Unknown version " + encrypted[0]);
        }

        if (encrypted.length <= offset) { throw new IllegalArgumentException("given data is incomplete"); }

        byte[] iv = offset == VERSION_SIZE ? null : Arrays.copyOfRange(encrypted, VERSION_SIZE, offset);

        try {
            final Cipher cipher;
            cipher = decryptingCipher(key, iv);
            return cipher.doFinal(encrypted, offset, encrypted.length - offset);
        } catch (SecurityException e) {
            throw e;
        } catch (Exception e) {
            throw new SecurityException(e);
        }
    }

    private String decryptOnlyString(Key key, String encrypted) throws SecurityException {
        try {
            if (encrypted == null) { return null; }
            if (encrypted.isEmpty()) { return encrypted; }
            return new String(rawDecrypt(key, decode64(encrypted)), encoding);
        } catch (Exception e) {
            throw new SecurityException(e);
        }
    }

    private String decryptString(Key key, String encrypted) throws SecurityException {
        try {
            return decryptOnlyString(key, encrypted);
        } catch (Exception e) {
            throw new RuntimeException("Failed to decrypt");
        }
    }

    public static void main(String[] args) {
        try {
            String secret = "12345678901234567890123456789012";
            String input = "testemail@ce.com|testCompanyAlias";
            Key key = new SecretKeySpec(secret.getBytes(UTF_8), AES);
            AES aes = new AES();

            String encrypted = aes.encryptString(key, input);
            String decrypted = aes.decryptString(key, encrypted);
            //Test
            System.out.println(input.equalsIgnoreCase(decrypted));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

