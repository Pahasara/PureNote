using FluentValidation;
using PureNote.Api.Models.DTOs.Diary;

namespace PureNote.Api.Validators;

public class DecryptedEntryDtoValidator: AbstractValidator<DecryptedEntryDto>
{
        public DecryptedEntryDtoValidator()
        {
                RuleFor(e => e.Password)
                        .NotEmpty().WithMessage("Password is required")
                        .MinimumLength(6).WithMessage("Password must be at least 6 characters long");
        }
}
