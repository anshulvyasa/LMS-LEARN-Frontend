//First of All this is FormControl  file and this may be little bit complicated 
//Suggestion => start reading from return statement of FormControl methord in which we are iterating on formControl aray using map
//here we also have helper function in which we are indivisually returning the elemnent (element can be input,textArea,selectItem)
 

import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Textarea } from "../ui/textarea";

function FormControls({ formControl = [], formData, setFormData }) {

  
  //this is a Helper function for deploying items
  function RenderComponentByType(getControlItem) {
    let element = null;
    const currentControlItemValue=formData[getControlItem.name]||'';

    switch (getControlItem.componentType) {
      case 'input':
        element = (
          <Input
            id={getControlItem.name}
            name={getControlItem.name}
            placeholder={getControlItem.Placeholder}
            type={getControlItem.type}
            value={currentControlItemValue}
            onChange={(event)=>setFormData({
              ...formData,
              [getControlItem.name]:event.target.value
            })}
          />
        );
        break;
      case "select":
        element = (
          <Select
          onValueChange={(value)=>setFormData({
            ...formData,
            [getControlItem.name]:value
          })}
          value={currentControlItemValue}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );
        break;
      case "textarea":
        element = (
          <Textarea
            id={getControlItem.name}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            value={currentControlItemValue}
            onChange={(event)=>setFormData({
              ...formData,
              [getControlItem.name]:event.target.value
            })}
          />
        );
        break;
      default:
        <Input
          id={getControlItem.name}
          name={getControlItem.name}
          placeholder={getControlItem.placeholder}
          value={currentControlItemValue}
            onChange={(event)=>setFormData({
              ...formData,
              [getControlItem.name]:event.target.value
            })}
        />;
        break;
    }


    return element;
  }

  return (
    <div className="flex flex-col gap-3">
      {formControl.map((controlItem) => (
        <div key={controlItem.name}>
          <label htmlFor={controlItem.name}>{controlItem.label}</label>
          {RenderComponentByType(controlItem)}
        </div>
      ))}
    </div>
  );
}
export default FormControls;
