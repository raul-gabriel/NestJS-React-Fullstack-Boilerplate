import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UsuarioSchema, type UsuarioForm } from '../../utils/schemas/validacion';
import { estadoSelect, tipoUsuario, type Usuario } from '@/utils/types/Mi_types';
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectField';
import Modal from '@/components/globales/Modal';
import { Col, Row } from '@/components/globales/FlexRow';

interface UsuarioModalProps {
  isOpen: boolean;
  cerrarModal: () => void;
  dataModificar?: Partial<Usuario>;
  onSave: (data: UsuarioForm) => void;
}

const FormularioUsuarios: React.FC<UsuarioModalProps> = ({ isOpen, cerrarModal, dataModificar, onSave }) => {


  const { register, handleSubmit, reset, formState: { errors } } = useForm<UsuarioForm>({
    resolver: zodResolver(UsuarioSchema),
    defaultValues: { estado: 'activo' },
  });



  useEffect(() => {
    if (dataModificar) {
      reset({
        nombres: dataModificar.nombres ?? '',
        email: dataModificar.email ?? '',
        telefono: dataModificar.telefono ?? '',
        tipo_usuario: dataModificar.tipo_usuario ?? 'Cliente',
        estado: dataModificar.estado ?? 'activo',
        password: '__SIN_CAMBIO__',
      });
    } else {
      reset({ estado: 'activo', password: '' });
    }
  }, [dataModificar, reset]);

  const onSubmit = (data: UsuarioForm) => {
    onSave(data);
    cerrarModal();
  };

  return (
    <Modal isOpen={isOpen} onClose={cerrarModal} size="medium" title={dataModificar ? "Editar Usuario" : "Registrar Usuario"}>
      <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto">
        <Row>
          <Col xs={12} md={6} className="p-1">
            <InputField name="nombres" type="text" register={register("nombres")} error={errors.nombres} />
          </Col>
          <Col xs={12} md={6} className="p-1">
            <InputField name="email" type="email" register={register("email")} error={errors.email} />
          </Col>
        </Row>

        <Row>
          <Col xs={12} md={6} className="p-1">
            <InputField name="telefono" type="tel" register={register("telefono")} error={errors.telefono} />
          </Col>
          <Col xs={12} md={6} className="p-1">
            <InputField
              label={dataModificar ? "Nuevo password (si desea cambiar)" : "Password"}
              name="password"
              type="password"
              register={register("password")}
              error={errors.password}
            />
          </Col>
        </Row>

        <Row>
          <Col xs={12} md={6} className="p-1">
            <SelectField
              label="Tipo Usuario"
              name="tipo_usuario"
              register={register("tipo_usuario")}
              error={errors.tipo_usuario}
              options={[...tipoUsuario]}
            />
          </Col>
          <Col xs={12} md={6} className="p-1">
            <SelectField
              label="Estado"
              name="estado"
              register={register("estado")}
              error={errors.estado}
              options={estadoSelect}
            />
          </Col>
        </Row>

        <div className="flex justify-end mt-6 space-x-4">
          <button type="button" onClick={cerrarModal} className="btnModalCancelar">Cancelar</button>
          <button type="submit" className="btnModal">{dataModificar ? "Actualizar" : "Guardar"}</button>
        </div>
      </form>
    </Modal>
  );
};

export default FormularioUsuarios;