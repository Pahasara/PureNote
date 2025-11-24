using FluentValidation;
using PureNote.Api.Models.DTOs.Diary;

namespace PureNote.Api.Validators;

public class UpdateEntryDtoValidator : AbstractValidator<UpdateEntryDto>
{
    public UpdateEntryDtoValidator()
    {
        RuleFor(e => e.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(200).WithMessage("Title cannot exceed 100 characters");

        RuleFor(e => e.Password)
            .NotEmpty().WithMessage("Password is required");
        
        RuleFor(e => e.Mood)
            .MaximumLength(50).WithMessage("Mood cannot exceed 20 characters");

        RuleFor(e => e.Tags)
            .Must(tags => tags == null || tags.Count <= 20)
            .WithMessage("Maximum allowed tags are 20.")
            .ForEach(tag => tag.MaximumLength(50));
    }
}
