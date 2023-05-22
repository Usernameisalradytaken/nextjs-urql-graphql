import React, { InputHTMLAttributes } from "react";
import { useField } from "formik";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
  TextareaProps,
  ComponentWithAs,
  InputProps,
  EditableTextarea,
} from "@chakra-ui/react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  placeholder: string;
  textArea?: boolean;
  label: string;
};

const InputField: React.FC<InputFieldProps> = ({
  size,
  textArea,
  ...props
}) => {
  const [field, { error }] = useField(props);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
      {textArea ? (
        <Textarea {...field} {...props} id={field.name} />
      ) : (
        <Input {...field} {...props} id={field.name} />
      )}
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};

export default InputField;
