using FluentValidation;
using FluentValidation.AspNetCore;
using MarketPlace.Business.Repositories.Inventory.Interface;
using MarketPlace.Business.Repositories.Inventory.Respository;
using MarketPlace.Business.Services.Interface;
using MarketPlace.Business.Services.Interface.Inventory;
using MarketPlace.Business.Services.Interface.MarkUps;
using MarketPlace.Business.Services.Interface.Promotions;
using MarketPlace.Business.Services.Services;
using MarketPlace.Business.Services.Services.Inventory;
using MarketPlace.Business.Services.Services.MarkUps;
using MarketPlace.Business.Services.Services.Promotions;
using MarketPlace.Common.Mapping;
using MarketPlace.Common.Validator;
using MarketPlace.DataAccess.DBContext;
using MarketPlace.DataAccess.Repositories.Inventory.Interface;
using MarketPlace.DataAccess.Repositories.Inventory.Respository;
using MarketPlace.DataAccess.Repositories.Markup.Interface;
using MarketPlace.DataAccess.Repositories.Markup.Repository;
using MarketPlace.DataAccess.Repositories.Promotions.Interface;
using MarketPlace.DataAccess.Repositories.Promotions.Repository;
using MarketPlace.Infrastructure.Services;
using MarketPlace.Infrastucture.JwtTokenGenerator;
using MarketPlace.Infrastucture.Markup.Commands.CreateMarkup;
using MarketPlace.Infrastucture.Promotion.Commands.CreatePromotion;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Config & DbContext
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
        sql => sql.EnableRetryOnFailure()));

// Services
builder.Services.AddHttpContextAccessor();
builder.Services.AddControllers();
builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<JwtTokenGenerator>();
builder.Services.AddScoped<IDeparturePortService, CruiseDeparturePortService>();
builder.Services.AddScoped<ICruiseDeparturePortRepository, CruiseDeparturePortRepository>();
builder.Services.AddScoped<ICruiseInventoryService, CruiseInventoryService>();
builder.Services.AddScoped<ICruiseInventoryRepository, CruiseInventoryRepository>();
builder.Services.AddScoped<ICruiseLineService, CruiseLineService>();
builder.Services.AddScoped<ICruiseShipService, CruiseShipServices>();
builder.Services.AddScoped<ICruiseShipRepository, CruiseShipRepository>();
builder.Services.AddScoped<ICruiseLineService, CruiseLineService>();
builder.Services.AddScoped<ICruiseLineRepository, CruiseLineRepository>();
builder.Services.AddScoped<ICruisePricingService, CruisePricingService>();
builder.Services.AddScoped<ICruisePricingRepository, CruisePricingRepository>();
builder.Services.AddScoped<IPromotionRepository, PromotionRepository>();
builder.Services.AddScoped<IPromotionService, PromotionService>();
builder.Services.AddValidatorsFromAssemblyContaining<PromotionValidator>();
builder.Services.AddScoped<ICruisePricingRepository, CruisePricingRepository>();
builder.Services.AddValidatorsFromAssemblyContaining<PromotionValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<PromotionCalculationValidator>();
builder.Services.AddScoped<IDestinationService, CruiseDestinationService>();
builder.Services.AddScoped<ICruiseDestinationRepository, CruiseDestinationRepository>();
builder.Services.AddScoped<ICruiseCabinService, CruiseCabinService>();
builder.Services.AddScoped<ICruiseCabinRepository, CruiseCabinRepository>();
builder.Services.AddScoped<ICruiseDeckImageRepository, CruiseDeckImageRepository>();

builder.Services.AddScoped<IMarkupRepository, MarkupRepository>();
builder.Services.AddScoped<IMarkupsService, MarkUpsService>();

builder.Services.AddScoped<ICruisePromotionPricingRepository, CruisePricingPromotionRepository>();
builder.Services.AddScoped<ICruisePromotionPricingService, CruisePromotionPricingService>();

builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(CreateMarkupCommand).Assembly));
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(CreatePromotionCommand).Assembly));
builder.Services
    .AddFluentValidationAutoValidation()
    .AddFluentValidationClientsideAdapters();
// JWT settings
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
// Email
builder.Services.AddScoped<IEmailService, EmailService>();


// Configure JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtSettings["Key"] ?? throw new InvalidOperationException("JWT Key is missing"))
        )
    };

    // ✅ Extract JWT from HTTP-only cookie
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            if (context.Request.Cookies.ContainsKey("accessToken"))
            {
                context.Token = context.Request.Cookies["accessToken"];
            }
            return Task.CompletedTask;
        }
    };
});

// Authorization
builder.Services.AddAuthorization();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
    {
        builder.WithOrigins("https://localhost:3000") // frontend
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();
    });
});


// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(o =>
{
    o.SwaggerDoc("v1", new OpenApiInfo { Title = "MarketPlace API", Version = "v1" });
    o.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Enter JWT token in format: Bearer {token}",
        Name = "Authorization",
        In = ParameterLocation.Cookie,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    o.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Middleware order is important
if (app.Environment.IsDevelopment())
{

}
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

// ✅ CORS must be before auth
app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
