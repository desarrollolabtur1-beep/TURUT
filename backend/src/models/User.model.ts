import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IVisitedDestination {
  destination: Types.ObjectId;
  visitedAt: Date;
}

// ── Preferencias de exploración ──────────────────────────────────────────────
export interface IPreferences {
  experienceTypes: string[];
  travelCompany: string;
  availableTime: string;
  coffeeExperience: string;
  coffeeInterests: string[];
  naturePreferences: string[];
  lodgingStyle: string;
  connectivityPreference: string;
  escapeTime: string;
}

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  isActive: boolean;
  profileImage: string;
  bio: string;
  visitedDestinations: IVisitedDestination[];
  // ── Datos demográficos ──
  city: string;
  phone: string;
  birthDate: Date | null;
  gender: string;
  // ── Preferencias de exploración ──
  preferences: IPreferences;
  // ── Necesidades especiales ──
  specialNeeds: string[];
  // ── Canal de adquisición ──
  acquisitionSource: string;
  // ── Reset de contraseña ──
  resetPasswordToken: string;
  resetPasswordExpires: Date | null;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// ── Enums de validación ──────────────────────────────────────────────────────
const EXPERIENCE_TYPES = ['naturaleza', 'cultura', 'gastronomia', 'entretenimiento', 'bienestar', 'fotografia'];
const TRAVEL_COMPANY = ['', 'solo', 'pareja', 'familia', 'amigos'];
const AVAILABLE_TIME = ['', 'medio_dia', 'dia_completo', 'fin_de_semana', 'varios_dias'];
const COFFEE_EXPERIENCE = ['', 'varias_veces', 'una_vez', 'nunca'];
const COFFEE_INTERESTS = ['catar', 'proceso', 'paisaje', 'fotografia', 'comprar'];
const NATURE_PREFERENCES = ['montana', 'rios_cascadas', 'bosque_fauna', 'paisaje_cafetero', 'cielos_nocturnos'];
const LODGING_STYLE = ['', 'rustico', 'finca_tradicional', 'confortable'];
const CONNECTIVITY_PREFERENCE = ['', 'necesito_wifi', 'desconectarme', 'me_da_igual'];
const ESCAPE_TIME = ['', 'fines_de_semana', 'puentes_festivos', 'vacaciones', 'flexible'];
const GENDER = ['', 'masculino', 'femenino', 'otro', 'prefiero_no_decir'];
const SPECIAL_NEEDS = ['movilidad_reducida', 'bebe_nino', 'mascota', 'adulto_mayor', 'auditiva_visual', 'ninguna'];
const ACQUISITION_SOURCE = ['', 'instagram_tiktok', 'google', 'recomendacion', 'publicidad', 'evento', 'otro'];

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Por favor ingresa un email válido',
      ],
    },
    password: {
      type: String,
      required: [true, 'Contraseña es obligatoria'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
      select: false, // No incluir en queries por defecto
    },
    firstName: {
      type: String,
      required: [true, 'Nombre es obligatorio'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Apellido es obligatorio'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    profileImage: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
      maxlength: [300, 'La bio no puede superar 300 caracteres'],
      trim: true,
    },
    visitedDestinations: [
      {
        destination: {
          type: Schema.Types.ObjectId,
          ref: 'Experience',
          required: true,
        },
        visitedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ── Datos demográficos ──────────────────────────────────────────────────
    city: {
      type: String,
      default: '',
      trim: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    birthDate: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      enum: GENDER,
      default: '',
    },

    // ── Preferencias de exploración ─────────────────────────────────────────
    preferences: {
      experienceTypes: {
        type: [String],
        enum: EXPERIENCE_TYPES,
        default: [],
      },
      travelCompany: {
        type: String,
        enum: TRAVEL_COMPANY,
        default: '',
      },
      availableTime: {
        type: String,
        enum: AVAILABLE_TIME,
        default: '',
      },
      coffeeExperience: {
        type: String,
        enum: COFFEE_EXPERIENCE,
        default: '',
      },
      coffeeInterests: {
        type: [String],
        enum: COFFEE_INTERESTS,
        default: [],
      },
      naturePreferences: {
        type: [String],
        enum: NATURE_PREFERENCES,
        default: [],
      },
      lodgingStyle: {
        type: String,
        enum: LODGING_STYLE,
        default: '',
      },
      connectivityPreference: {
        type: String,
        enum: CONNECTIVITY_PREFERENCE,
        default: '',
      },
      escapeTime: {
        type: String,
        enum: ESCAPE_TIME,
        default: '',
      },
    },

    // ── Necesidades especiales ──────────────────────────────────────────────
    specialNeeds: {
      type: [String],
      enum: SPECIAL_NEEDS,
      default: [],
    },

    // ── Canal de adquisición ────────────────────────────────────────────────
    acquisitionSource: {
      type: String,
      enum: ACQUISITION_SOURCE,
      default: '',
    },

    // ── Reset de contraseña ──────────────────────────────────────────────────
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = model<IUser>('User', UserSchema);
