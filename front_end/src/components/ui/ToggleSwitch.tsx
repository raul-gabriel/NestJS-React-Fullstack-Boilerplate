import React from 'react';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';

interface ToggleSwitchProps {
    name: string;
    register: UseFormRegisterReturn;
    error?: FieldError;
    label?: string;
    onLabel?: string;
    offLabel?: string;
    activeColor?: string;
    disabled?: boolean;
    className?: string;
    defaultValue?: string;
}

const capitalizeFirstLetter = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1);

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
    name,
    register,
    error,
    label,
    onLabel = 'Activo',
    offLabel = 'Inactivo',
    activeColor = 'bg-primary-600',
    disabled = false,
    className = '',
    defaultValue,
}) => {
    const [isOn, setIsOn] = React.useState(defaultValue === onLabel);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setIsOn(checked);
        register.onChange({
            target: {
                name: register.name,
                value: checked ? onLabel : offLabel,
            },
        });
    };

    return (
        <div className={className}>
            <div className="flex flex-col mb-4">
                <label className="block font-medium text-[14px] mb-1">
                    {label || capitalizeFirstLetter(name)}
                </label>

                <label className={`flex gap-3 w-fit select-none ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                    <div className="relative">
                        <input
                            type="checkbox"
                            className="sr-only"
                            disabled={disabled}
                            checked={isOn}
                            onChange={handleChange}
                        />
                        <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${isOn ? activeColor : 'bg-gray-200'}`} />
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${isOn ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                    <span className="text-sm text-gray-700">
                        {isOn ? onLabel : offLabel}
                    </span>
                </label>

                {error && <p className="text-colorError text-[12px] mt-1">{error.message}</p>}
            </div>
        </div>
    );
};

export default ToggleSwitch;


/*
<ToggleSwitch
    label='Estado'
    name="estado"
    register={register('estado')}
    error={errors.estado}
    onLabel="habilitado"
    offLabel="bloqueado"
    defaultValue="habilitado"  // ← esto sincroniza el toggle con el default del schema
/>
*/