namespace PureNote.Api.Services;

public interface IEncryptionService
{
    string Encrypt(string plainText, string password, string saltBase64);
    string Decrypt(string cipherText, string password, string saltBase64);
}
