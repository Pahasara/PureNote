using System.Security.Cryptography;
using System.Text;

namespace PureNote.Api.Services;

public static class EncryptionService
{
    private const int KeySizeInBytes = 32;      // 256-bit key
    private const int NonceSizeInBytes = 12;    // Recommended for AES-GCM
    private const int TagSizeInBytes = 16;      // 128-bit auth tag
    private const int SaltSizeInBytes = 32;     // Per-user salt
    private const int Iterations = 600_000;     // OWASP 2023
    
    public static string Encrypt(string plainText, string password, string saltBase64)
    {
        byte[] key = DeriveKeyFromPassword(password, saltBase64);
        
        // Generate random nonce
        byte[] nonce = new byte[NonceSizeInBytes];
        RandomNumberGenerator.Fill(nonce);
        
        byte[] plainBytes = Encoding.UTF8.GetBytes(plainText);
        byte[] cipherBytes = new byte[plainBytes.Length];
        byte[] tag = new byte[TagSizeInBytes];

        using var aes = new AesGcm(key, TagSizeInBytes);
        aes.Encrypt(nonce, plainBytes, cipherBytes, tag);
        
        // Final storage layout: nonce|tag|ciphertext
        var result = new byte[NonceSizeInBytes + TagSizeInBytes + cipherBytes.Length];
        Buffer.BlockCopy(nonce, 0, result, 0, NonceSizeInBytes);
        Buffer.BlockCopy(tag, 0, result, NonceSizeInBytes, TagSizeInBytes);
        Buffer.BlockCopy(cipherBytes, 0, result, NonceSizeInBytes + TagSizeInBytes, cipherBytes.Length);
        
        return Convert.ToBase64String(result);
    }

    public static string Decrypt(string cipherText, string password, string saltBase64)
    {
        byte[] key = DeriveKeyFromPassword(password, saltBase64);
        byte[] encryptedData = Convert.FromBase64String(cipherText);
        
        // Extract layout: nonce|tag|ciphertext
        ReadOnlySpan<byte> nonce = encryptedData.AsSpan(0, NonceSizeInBytes);
        ReadOnlySpan<byte> tag = encryptedData.AsSpan(NonceSizeInBytes, TagSizeInBytes);
        ReadOnlySpan<byte> cipherBytes = encryptedData.AsSpan(NonceSizeInBytes + TagSizeInBytes);

        var plainBytes = new byte[cipherBytes.Length];
        
        using var aes = new AesGcm(key, TagSizeInBytes);

        try
        {
            aes.Decrypt(nonce, cipherBytes, tag, plainBytes);
        }
        catch (CryptographicException)
        {
            throw new InvalidOperationException("Invalid encrypted data or wrong password.");
        }
        
        return Encoding.UTF8.GetString(plainBytes);
    }

    private static byte[] DeriveKeyFromPassword(string password, string saltBase64)
    {
        byte[] salt = Convert.FromBase64String(saltBase64);

        return Rfc2898DeriveBytes.Pbkdf2(
             password,
             salt,
             Iterations,
             HashAlgorithmName.SHA256, 
             KeySizeInBytes
        );
    }

    public static string GenerateUserSalt()
    {
        var salt = new byte[SaltSizeInBytes];
        RandomNumberGenerator.Fill(salt);
        return Convert.ToBase64String(salt);
    }
}
