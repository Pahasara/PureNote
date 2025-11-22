namespace PureNote.Api.Services;

public interface IEncryptionService
{
    string Encrypt(string plainText, string userPassword, string userSalt);
    string Decrypt(string cipherText, string userPassword, string userSalt);
}
