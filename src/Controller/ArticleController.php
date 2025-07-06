<?php

namespace App\Controller;

use App\Entity\Article;
use App\Repository\ArticleRepository;
use Doctrine\ORM\EntityManagerInterface;
use PhpCsFixer\Console\Report\FixReport\JsonReporter;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\SerializerInterface;

class ArticleController extends AbstractController
{

    #[Route(path:"/article/new", name:"app_article_new")]
    public function index():Response
    {
        return  $this->render('article/new.html.twig',[]);
    }

    #[Route('/articles', name: 'app_article')]
    public function getArtcicle(ArticleRepository $repo,NormalizerInterface $normalizer): Response
    {   
        $article = $repo->findAll();
        $serializedArticle = $normalizer->normalize($article,'json',[
            'groups'=>'user:read'
        ]);
        return $this->json($serializedArticle,201,[],['groups'=>'user:read']);
    }
    #[Route('/api/add',name:'app_add_article',methods:["POST"])]
    public function add(Request $request,SerializerInterface $serializer,EntityManagerInterface $em)
    {
        $data = $request->getContent();
        $article = $serializer->deserialize($data,Article::class,'json');
        //check off article if it already exist
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'User not anthenticated'], 401);
        }
        
        $isExistingArticle = $em->getRepository(Article::class)->findOneBy([
            'name'=>$article->getName()
        ]);
        if($isExistingArticle)
        {
            return new JsonResponse(['message' => 'Article already exist'], 401); 
        }
        
        $article->setUser($user);
        $em->persist($article);
        $em->flush();
        //dd($article);
        return $this->json($article,201,[],['groups'=>'user:read']);
    }
    #[Route('/api/update/{id}', name:'', methods: ['PUT'])]
    public function update(int $id, Request $req, SerializerInterface $serializer,EntityManagerInterface $em)
    {
        $user = $this->getUser();
         if(!$user){
            return new JsonResponse(['error'=>'User not aunthenticated'],401);
         } 
        $article = $em->getRepository(Article::class)->find($id);
        if(!$article){
            return new JsonResponse(['error'=>'Article not found']);
        }
        $data = $req->getContent();
        $serializer->deserialize($data,Article::class,'json',[
            'object_to_populate'=>$article
        ]);
        $input = json_decode($data,true);
        if(isset($input['name'])){
            $isExisting = $em->getRepository(Article::class)->findOneBy([
                'name'=>$input['name'],
                'user'=>$user
            ]);
            if($isExisting && $isExisting->getId() !== $article->getId()){
                return new JsonResponse(['message'=>'Article name already used'],409);
            }
        }
        $article->setUser($user);
        $em->flush();
        return $this->json($article,200,[],['groups'=>'user:read']);
    }

    #[Route('/api/delete/{id}',name:'delete',methods:['DELETE'])]
    public function delete(int $id, EntityManagerInterface $em)
    {
        $user = $this->getUser();
        if(!$user){
            return new JsonResponse(['error'=>'User not authenticated'],401);
        }
        $article = $em->getRepository(Article::class)->find($id);
        if(!$article){
            return 
            new JsonResponse(['error'=>'Article not found'],404);
        }
        /*if($article->getUser() !== $user){
            return  new JsonResponse(['error'=>'Unauthorized'],403);     
        }*/
        $em->remove($article);
        $em->flush();
        return new JsonResponse(['message'=> 'Article deleted']);
    }


}
