<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
class AuthController extends AbstractController
{
    #[Route('/api/register', name: 'app_auth',methods:['POST'])]
    public function register(Request $request,UserPasswordHasherInterface $hasher, EntityManagerInterface $em):JsonResponse
    {
        $data = json_decode($request->getContent(),true);
        if(!isset($data['email']) || !isset($data['password'])){
            return new JsonResponse(['message'=>'Email and  Password cannot be blank']);
        }
        //check if the user already exist
        $existingUser = $em->getRepository(User::class)->findOneBy(['email'=> $data['email']]);
        if($existingUser){
            return new JsonResponse(["message"=>'email already exist'],409);
        }
        $user = new User();
        $user
            ->setEmail($data['email'])
            ->setPassword($hasher->hashPassword($user,$data['password']));
        $em->persist($user);
        $em->flush();
        return new JsonResponse(['message'=>'User registered'],201);
    }

    #[Route('/api/user', name:'api_authenticated', methods: ['GET'])]
    //#[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function getUserAuthenticated()
    {
        /**
         * @var \App\Entity\User $user
         */
        $user = $this->getUser();
        if(!$user){
            return new JsonResponse(['error'=>'User not authenticated'],401);
        }
        return new JsonResponse([
            'id'=> $user->getId(),
            'email'=> $user->getEmail(),
        ]);
    }
}
