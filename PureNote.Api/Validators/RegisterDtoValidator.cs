using FluentValidation;
using PureNote.Api.Models.DTOs.Auth;

namespace PureNote.Api.Validators;

public class RegisterDtoValidator : AbstractValidator<RegisterDto>
{
    public RegisterDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();
        
        RuleFor(x => x.Username)
            .NotEmpty()
            .Length(3, 25);
        
        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(6);
        
        RuleFor(x => x.FirstName)
            .MaximumLength(50);
        
        RuleFor(x => x.LastName)
            .MaximumLength(50);
    }
}
