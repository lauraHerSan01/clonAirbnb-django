'use client';

import Modal from "./Modal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useLoginModal from "@/app/hooks/useLoginModal";
import CustomButton from "../forms/CustomButton";
import { handleLogin } from "@/app/lib/actions";
import apiService from "@/app/services/apiService";

const LoginModal =()=>{
    const router = useRouter()
    const LoginModal = useLoginModal()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<string[]>([]);

    const submitLogin = async () => {
        const fromData ={
            email: email,
            password: password
        }

        const response = await apiService.post('/api/auth/login/', JSON.stringify(fromData))

        if (response.access){
            handleLogin(response.user.pk, response.access, response.refhesh);

            LoginModal.close();

            router.push('/')
        } else{
            setErrors(response.non_field_errors);
        }
    }


    const content =(
        <>
            <form 
                action={submitLogin}
                className="space-y-4">
                <input onChange={(e) => setEmail(e.target.value)} placeholder="Your e-mail address" type="email" className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" />
                <input onChange={(e) => setPassword(e.target.value)} placeholder="Your password" type="password" className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" />

                {errors.map((error, index) => {
                    return(
                        <div 
                            key={`error_${index}`}
                            className="p-5 bg-airbnb text-white rounded-xl opacity-80"
                        >
                            {error}
                        </div>
                    )
                })}

                <CustomButton
                    label="Submit"
                    onClick={submitLogin}
                />
            </form>
        </>
        )

    return(
        <Modal
            isOpen={LoginModal.isOpen}
            close={LoginModal.close}
            label="Log in"
            content={content}
        />
    )
}

export default LoginModal;